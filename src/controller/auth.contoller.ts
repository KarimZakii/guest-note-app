import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

import * as express from "express";
const { validationResult } = require("express-validator");

/* REGISTER USER */
export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { username, password, email } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: "validation failed" });
    }
    if (!req.files) {
      return res.status(400).json({ error: "Files not found in the request" });
    }

    const profilePicURL: string = req.files[0].path;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: passwordHash,
      profilePicURL,
      email,
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (error: any) {
    res.json({ error: error.message });
  }
};

/* LOGIN */
export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { username, password }: { username: string; password: string } =
      req.body;
    const user: User | null = await User.findOne({ where: { username } });
    if (!user) return res.status(400).json({ message: "User does not exist." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials." });

    const token = jwt.sign(
      { id: user.id },
      "Y0u-Kn0w-517-H4pp3n5-50m371m35-3v3n-7h0u9h-W3-W15h-1t-D1d-N07-6u7-W3-4r3-H3r3-70-H3lp-H0w3v3r-W3-C4n"
    );
    res
      .status(200)
      .json({ token, user: { username: user.username, _id: user.id } });
  } catch (error: any) {
    res.json({ error: error.message });
  }
};
