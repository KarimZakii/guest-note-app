import express from "express";
import { register, login } from "../controller/auth.contoller";
const { check, body } = require("express-validator");

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post(
  "/register",
  [check("email").isEmail(), body("password").isLength({ min: 8 })],
  register
);

export default authRouter;
