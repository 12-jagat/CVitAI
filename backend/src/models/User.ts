import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  avatar?: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  googleId?: string;
  refreshTokens: string[];
  reviewsUsed: number;
  creationsUsed: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function (this: IUser) {
        return !this.googleId; // Password only required if not using Google OAuth
      },
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    googleId: {
      type: String,
      sparse: true,
    },
    refreshTokens: {
      type: [String],
      default: [],
    },
    reviewsUsed: {
      type: Number,
      default: 0,
    },
    creationsUsed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password
UserSchema.pre('save', async function (next) {
  const user = this as IUser;
  if (!user.isModified('password') || !user.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

export const User = model<IUser>('User', UserSchema);
