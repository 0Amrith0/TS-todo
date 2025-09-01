import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

export interface AuthRequest extends Request {
  user?: IUser;
}

interface DecodedToken extends JwtPayload {
  userId: string;
}

export const protectRoute = async ( req: AuthRequest, res: Response, next: NextFunction ): Promise<void> => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      res.status(401).json({ error: "Unauthorized: No Token Provided" });
      return;
    }

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    if (!decoded?.userId) {
      res.status(401).json({ error: "Unauthorized: Invalid token" });
      return;
    }


    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware", error);
    res.status(500).json({ error: "Internal server error" });
  }
};