import nodemailer from 'nodemailer';
import { env } from '../config/env';

const createTransporter = () => {
  // If SMTP configurations are not fully set, we can return a mock transporter
  // or log emails to the console for development ease
  if (!env.SMTP_USER || !env.SMTP_PASS) {
    console.log('⚠️ SMTP Credentials missing. Emails will be logged to console.');
    return null;
  }

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: parseInt(env.SMTP_PORT, 10),
    secure: env.SMTP_PORT === '465',
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
};

const transporter = createTransporter();

export const sendVerificationEmail = async (email: string, name: string, token: string): Promise<void> => {
  const verifyUrl = `${env.CLIENT_URL}/verify-email?token=${token}&email=${email}`;
  const subject = 'Verify Your Email Address - CVItAI';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #2563eb; text-align: center;">Welcome to CVItAI!</h2>
      <p>Hi ${name},</p>
      <p>Thank you for signing up. Please click the button below to verify your email address and unlock all premium AI features:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verifyUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verify Email Address</a>
      </div>
      <p>Or copy and paste this link in your browser:</p>
      <p style="word-break: break-all; color: #4b5563;"><a href="${verifyUrl}">${verifyUrl}</a></p>
      <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #9ca3af; text-align: center;">This link will expire in 24 hours. If you did not create an account, please ignore this email.</p>
    </div>
  `;

  if (!transporter) {
    console.log(`\n📬 [EMAIL SIMULATION] Send email to: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Verification URL: ${verifyUrl}\n`);
    return;
  }

  try {
    await transporter.sendMail({
      from: `"CVItAI" <${env.EMAIL_FROM}>`,
      to: email,
      subject,
      html,
    });
  } catch (error) {
    console.error(`❌ Failed to send verification email via SMTP to ${email}:`, error);
  }
};

export const sendResetPasswordEmail = async (email: string, name: string, token: string): Promise<void> => {
  const resetUrl = `${env.CLIENT_URL}/reset-password?token=${token}&email=${email}`;
  const subject = 'Reset Your Password - CVItAI';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #2563eb; text-align: center;">Password Reset Request</h2>
      <p>Hi ${name},</p>
      <p>We received a request to reset your password. Click the button below to set up a new password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      <p>Or copy and paste this link in your browser:</p>
      <p style="word-break: break-all; color: #4b5563;"><a href="${resetUrl}">${resetUrl}</a></p>
      <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #9ca3af; text-align: center;">This link will expire in 1 hour. If you did not request a password reset, please ignore this email.</p>
    </div>
  `;

  if (!transporter) {
    console.log(`\n📬 [EMAIL SIMULATION] Send email to: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Reset URL: ${resetUrl}\n`);
    return;
  }

  try {
    await transporter.sendMail({
      from: `"CVItAI" <${env.EMAIL_FROM}>`,
      to: email,
      subject,
      html,
    });
  } catch (error) {
    console.error(`❌ Failed to send reset password email via SMTP to ${email}:`, error);
  }
};
export const sendVerificationCode = async (email: string, name: string, code: string): Promise<void> => {
  const subject = 'Your Verification Code - CVItAI';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #2563eb; text-align: center;">Your Verification Code</h2>
      <p>Hi ${name},</p>
      <p>Thank you for signing up. Please enter the following code on the verification screen to verify your email address:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e3a8a; background-color: #eff6ff; padding: 10px 20px; border-radius: 8px; border: 1px dashed #bfdbfe;">${code}</span>
      </div>
      <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #9ca3af; text-align: center;">This code will expire in 1 hour. If you did not register, please ignore this email.</p>
    </div>
  `;

  if (!transporter) {
    console.log(`\n📬 [EMAIL SIMULATION] Send verification code to: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Code: ${code}\n`);
    return;
  }

  try {
    await transporter.sendMail({
      from: `"CVItAI" <${env.EMAIL_FROM}>`,
      to: email,
      subject,
      html,
    });
  } catch (error) {
    console.error(`❌ Failed to send verification code email via SMTP to ${email}:`, error);
  }
};
