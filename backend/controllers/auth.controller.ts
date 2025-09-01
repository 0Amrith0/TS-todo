import e, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import { AuthRequest } from "../middleware/protectRoute";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken";
import User, { IUser } from "../models/user.model";
import { generateOTP } from "../lib/utils/generateOTP";

interface SignupBody {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

interface LoginBody { 
  username: string; 
  password: string; 
}

dotenv.config();

export const signup = async ( req: Request<{}, {}, SignupBody>, res: Response ): Promise<void> => {
  try {
    const { fullName, username, email, password } = req.body;

    const emailRegeX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegeX.test(email)) {
      res.status(400).json({ error: "Invalid email format" });
      return;
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ error: "Username is already taken" });
      return;
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      res.status(400).json({ error: "Email is already in use" });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters long" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const {otp, otpExpiry} = generateOTP();

    const newUser: IUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
      otp,
      otpExpiry
    });

    if(newUser){
      generateTokenAndSetCookie(newUser._id, res)
      await newUser.save();

      res.status(201).json({
        user: {
          id: newUser._id,
          fullName: newUser.fullName,
          username: newUser.username,
          email: newUser.email,
          otp,
          otpExpiry
        }
      })

    }else {
        res.status(400).json({ error: "Invalid user data" });
        }
  } catch (error) {
    console.error("Error in signup controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async ( req: Request<{}, {}, LoginBody>, res: Response ): Promise<void> => { 
  try { 
    const { username, password } = req.body; 

    const user = await User.findOne({ username }); 

    if (!user) { 
      res.status(400).json({ error: "Invalid username" }); 
      return; } 

    const isPasswordCorrect = await bcrypt.compare(password, user.password); 

    if (!isPasswordCorrect) { 
      res.status(400).json({ error: "Invalid password" }); 
      return; 
    } 
  
  generateTokenAndSetCookie(user._id, res); 
  
  res.status(200).json({ 
    id: user._id.toString(), 
    fullName: user.fullName, 
    username: user.username, 
    email: user.email, 
    notes: user.notes, 
    profileImg: user.profileImg 
  }); 
} 
catch (error) { 
  console.error("Error in login controller", error); 
  res.status(500).json({ error: "Internal server error" }); 
} 
}; 

export const logout = async ( req: Request, res: Response ): Promise<void> => { 
  try { 
    res.cookie("jwt", "", { maxAge: 0 }); 
    res.status(200).json({ message: "Logged out successfully" }); 
} catch (error) { 
  console.error("Error in logout controller", error); 
  res.status(500).json({ error: "Internal server error" }); 
  } 
};

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!user.otp || !user.otpExpiry) {
      res.status(400).json({ error: "No OTP found, please request again" });
      return;
    }

    if (user.otp !== otp) {
      res.status(400).json({ error: "Invalid OTP" });
      return;
    }

    if (user.otpExpiry < new Date()) {
      res.status(400).json({ error: "OTP expired" });
      return;
    }

    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error in verifyOTP controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getMe controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};