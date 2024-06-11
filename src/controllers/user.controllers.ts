import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import UserSchema from "../models/user.models";
import {
  sendResetPasswordEmail,
  setResetPasswordToken,
  verifyToken,
} from "../services/password.services";

// CREATE TOKEN
const maxAge = 30 * 24 * 60 * 60;
const createToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: maxAge,
  });
};

// USER CONTROLLER
export const userController = {
  // CREATE USER
  createUser: async function (req: Request, res: Response) {
    const { mail, phone, password, firstName } = req.body;

    if (!mail || !phone || !password || !firstName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const user = await UserSchema.create({
        mail,
        phone,
        password,
        firstName,
      });

      // VERIFY THAT USER DOESN'T EXIST
      if (!user) {
        return res.status(409).json({ error: "User already exists" });
      }

      const token = createToken(user._id);

      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(201).json({ user: user._id });
    } catch (err) {
      res.status(400).json({ err });
    }
  },

  // UPDATE USER
  updateUser: async function (req: Request, res: Response) {
    const { userId } = req.params;
    const { mail, phone, firstName } = req.body;

    try {
      const user = await UserSchema.findByIdAndUpdate(
        userId,
        { mail, phone, firstName },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({
        _id: user._id,
        mail: user.mail,
        phone: user.phone,
        firstName: user.firstName,
      });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  // UPDATE USER ROLE
  updateUserRole: async function (req: Request, res: Response) {
    const { userId } = req.params;
    const { isAdmin } = req.body;

    try {
      const user = await UserSchema.findByIdAndUpdate(
        userId,
        { isAdmin },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({
        _id: user._id,
        mail: user.mail,
        phone: user.phone,
        firstName: user.firstName,
        isAdmin: user.isAdmin,
      });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  // LOGIN
  login: async function (req: Request, res: Response) {
    const { phone, password } = req.body;

    try {
      const user = await UserSchema.login(phone, password);

      const token = createToken(user._id);

      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({
        _id: user._id,
        firstName: user.firstName,
        phone: user.phone,
        mail: user.mail,
        isAdmin: user.isAdmin,
      });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  // LOGOUT
  logout: function (req: Request, res: Response) {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "User logged out" });
  },

  // GET USERS WITHOUT PASSWORDS
  getUsers: async function (req: Request, res: Response) {
    try {
      const users = await UserSchema.find({}, { password: 0 });
      res.status(200).json(users);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  // DELETE USER
  deleteUser: async function (req: Request, res: Response) {
    const { userId } = req.params;

    try {
      const user = await UserSchema.findByIdAndDelete(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ message: "User deleted" });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  // REQUEST PASSWORD RESET
  requestPasswordReset: async function (req: Request, res: Response) {
    const { mail, lang } = req.body;

    try {
      // Set the reset password token and expiration date for the user
      const { user, resetPasswordToken } = await setResetPasswordToken(mail);

      // Send an email to the user with the reset password link
      await sendResetPasswordEmail(mail, resetPasswordToken, lang);

      res.status(200).json({ message: "Email sent" });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  // RESET PASSWORD
  resetPassword: async function (req: Request, res: Response) {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      // Find the user with the provided reset password token
      const user = await verifyToken(token);

      // If the user is not found, return an error
      if (!user) {
        return res.status(400).json({ error: "Invalid token" });
      }

      // Set the new password and reset the reset password token and expiration date
      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpiration = undefined;

      // Save the user
      await user.save();

      res.status(200).json({ message: "Password reset" });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },
};
