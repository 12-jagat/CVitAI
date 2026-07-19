import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { generateAccessToken, generateRefreshToken } from '../middleware/auth';
import { sendVerificationCode, sendResetPasswordEmail } from '../services/mailer';
import { env } from '../config/env';

// Helper to set refresh token cookie
const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

/**
 * Register User
 */
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'User already exists with this email' });
      return;
    }

    // Generate 6-digit email verification code
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Create user (password will be hashed by mongoose pre-save hook)
    const user = new User({
      email,
      password,
      name,
      verificationToken,
      verificationTokenExpires,
    });

    await user.save();

    // Send verification email
    await sendVerificationCode(user.email, user.name, verificationToken);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email for the verification code.',
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify Email Address
 */
export const verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({
      email,
      verificationToken: code,
      verificationTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
      return;
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // Generate JWT access & refresh tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token to user
    user.refreshTokens.push(refreshToken);
    await user.save();

    // Set refresh token in cookie
    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login User
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    // If using Google Auth, password might be empty
    if (!user.password) {
      res.status(400).json({ success: false, message: 'This account uses Google Login. Please login with Google.' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    // Require email verification
    if (!user.isVerified) {
      // Re-generate & send verification code
      const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
      user.verificationToken = verificationToken;
      user.verificationTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
      await user.save();

      await sendVerificationCode(user.email, user.name, verificationToken);

      res.status(403).json({
        success: false,
        message: 'Email is not verified. A new code has been sent to your email.',
        requiresVerification: true,
        email: user.email,
      });
      return;
    }

    // Generate JWT access & refresh tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token to user
    user.refreshTokens.push(refreshToken);
    await user.save();

    // Set refresh token in cookie
    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout User
 */
export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      // Remove token from database
      await User.updateOne(
        { refreshTokens: refreshToken },
        { $pull: { refreshTokens: refreshToken } }
      );
    }

    // Clear the cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh Tokens (Rotation)
 */
export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const oldRefreshToken = req.cookies?.refreshToken;

    if (!oldRefreshToken) {
      res.status(401).json({ success: false, message: 'Refresh token missing' });
      return;
    }

    // Clear old cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    // Find user with this refresh token
    const user = await User.findOne({ refreshTokens: oldRefreshToken });

    // Detect refresh token reuse / potential theft
    if (!user) {
      // Decode to identify user and purge all refresh tokens for security
      try {
        const decoded = jwt.verify(oldRefreshToken, env.JWT_REFRESH_SECRET) as { id: string };
        await User.findByIdAndUpdate(decoded.id, { refreshTokens: [] });
      } catch (err) {
        // Token is invalid/expired, do nothing
      }
      res.status(403).json({ success: false, message: 'Invalid refresh token, security breach detected' });
      return;
    }

    // Verify token
    try {
      jwt.verify(oldRefreshToken, env.JWT_REFRESH_SECRET);
    } catch (err) {
      // Expired token: remove it from user record
      user.refreshTokens = user.refreshTokens.filter((t) => t !== oldRefreshToken);
      await user.save();
      res.status(401).json({ success: false, message: 'Refresh token expired' });
      return;
    }

    // Token is valid: remove old refresh token, generate new access + refresh token
    user.refreshTokens = user.refreshTokens.filter((t) => t !== oldRefreshToken);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshTokens.push(newRefreshToken);
    await user.save();

    // Set new refresh token cookie
    setRefreshTokenCookie(res, newRefreshToken);

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Forgot Password
 */
export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // To prevent account enumeration, return success response even if email doesn't exist
      res.status(200).json({ success: true, message: 'If an account exists with this email, a reset link has been sent' });
      return;
    }

    // Generate password reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // Send reset email
    await sendResetPasswordEmail(user.email, user.name, resetToken);

    res.status(200).json({
      success: true,
      message: 'If an account exists with this email, a reset link has been sent',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset Password
 */
export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token, email, newPassword } = req.body;

    const user = await User.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ success: false, message: 'Invalid or expired password reset token' });
      return;
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    // Purge active sessions for security
    user.refreshTokens = [];
    await user.save();

    res.status(200).json({ success: true, message: 'Password has been reset successfully. Please login with your new password.' });
  } catch (error) {
    next(error);
  }
};

/**
 * Google Login (Authentication Token Exchange)
 */
export const googleLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token } = req.body; // Google access token or ID token

    if (!token) {
      res.status(400).json({ success: false, message: 'Google token is required' });
      return;
    }

    // Exchange token for Google profile info
    const googleResponse = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
    
    if (!googleResponse.ok) {
      // Try validating as ID token if access_token fails
      const idTokenResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
      if (!idTokenResponse.ok) {
        res.status(400).json({ success: false, message: 'Invalid Google token' });
        return;
      }
      const idTokenData = await idTokenResponse.json();
      return processGoogleUser(idTokenData, res, next);
    }

    const googleData = await googleResponse.json();
    return processGoogleUser(googleData, res, next);

  } catch (error) {
    next(error);
  }
};

// Process Google user registration/login
const processGoogleUser = async (googleData: any, res: Response, next: NextFunction) => {
  try {
    const { email, name, picture, sub } = googleData;

    if (!email) {
      res.status(400).json({ success: false, message: 'Google account does not provide an email address' });
      return;
    }

    let user = await User.findOne({ email });

    if (user) {
      // Connect Google account if not linked, or update avatar
      if (!user.googleId) {
        user.googleId = sub;
      }
      user.name = name || user.name;
      user.avatar = picture || user.avatar;
      user.isVerified = true; // Google accounts are verified
    } else {
      // Create user
      user = new User({
        email,
        name: name || 'Google User',
        avatar: picture || '',
        googleId: sub,
        isVerified: true,
      });
    }

    // Generate JWT tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshTokens.push(refreshToken);
    await user.save();

    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GitHub Login (Authentication Token Exchange)
 */
export const githubLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token } = req.body; // GitHub access token

    if (!token) {
      res.status(400).json({ success: false, message: 'GitHub access token is required' });
      return;
    }

    // Fetch GitHub profile details
    const githubResponse = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!githubResponse.ok) {
      res.status(400).json({ success: false, message: 'Invalid GitHub token' });
      return;
    }

    const githubData = await githubResponse.json() as any;

    // Fetch primary email address since GitHub email profiles are often private
    let email = githubData.email;
    if (!email) {
      const emailsResponse = await fetch('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (emailsResponse.ok) {
        const emails = await emailsResponse.json() as any;
        const primaryEmail = emails.find((e: any) => e.primary);
        email = primaryEmail ? primaryEmail.email : null;
      }
    }

    if (!email) {
      res.status(400).json({ success: false, message: 'GitHub account does not provide a public or primary email address' });
      return;
    }

    let user = await User.findOne({ email });

    if (user) {
      user.name = githubData.name || githubData.login || user.name;
      user.avatar = githubData.avatar_url || user.avatar;
      user.isVerified = true; // OAuth users are verified
    } else {
      user = new User({
        email,
        name: githubData.name || githubData.login || 'GitHub User',
        avatar: githubData.avatar_url || '',
        isVerified: true,
      });
    }

    // Generate JWT tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshTokens.push(refreshToken);
    await user.save();

    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};
