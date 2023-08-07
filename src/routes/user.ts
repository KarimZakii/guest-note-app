import { Router } from "express";
import {
  sendNote,
  latestNotes,
  deleteNote,
  test,
} from "../controller/user.controller";
import { auth } from "../middleware/auth";
const userRouter = Router();

userRouter.post("/sendnote", sendNote);
userRouter.get("/getnotes", auth, latestNotes);
userRouter.post("deleteNote", auth, deleteNote);
userRouter.get("/test", test);

export default userRouter;
