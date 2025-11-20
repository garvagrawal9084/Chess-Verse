import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY || "default_secret";

// Register User
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Ensure function returns void
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: "User Registered Successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server Error" });
  }
};

// Login User
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Ensure function returns void
  try {
    // console.log("Inside login user");
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    res
      .status(200)
      .json({ token, user: { username: user.username, email: user.email } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server Error" });
  }
};
