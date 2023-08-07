import { Router } from "express";
import {
  sendNote,
  latestNotes,
  deleteNote,
} from "../controller/user.controller";
import { auth } from "../middleware/auth";
const userRouter = Router();

userRouter.post("/sendnote", sendNote);
userRouter.get("/getnotes", auth, latestNotes);
userRouter.post("deleteNote", auth, deleteNote);

export default userRouter;
