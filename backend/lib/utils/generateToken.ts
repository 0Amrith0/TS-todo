import { Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export const generateTokenAndSetCookie = ( userId: Types.ObjectId, res: Response ): void => {
  const token = jwt.sign(
    { userId: userId.toString() },
    process.env.JWT_SECRET || "default_secret",
    { expiresIn: "7d" }
  );

  res.cookie("jwt", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // only true in prod
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});
};