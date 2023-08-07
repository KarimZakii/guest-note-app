import express from "express";
import db from "./DBConfig";
import cors from "cors";
import schedule from "node-schedule";
import * as dotenv from "dotenv";
import bodyParser, { urlencoded } from "body-parser";
import userRouter from "./routes/user";
import authRouter from "./routes/auth";
import seedNoteTypes from "./middleware/seed";
import multer from "multer";
import path from "path";
import dailyMail from "./Notifications/daily-mail";
dotenv.config();

const app = express();

app.use(cors());
app.options("*", cors());
app.use(bodyParser.json());

app.use(urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: "./files",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
  },
});
app.use(multer({ storage, limits: { fileSize: 1024 * 1024 * 1.7 } }).any());
app.use(express.static(path.join(__dirname, "files")));
app.use(userRouter);
app.use(authRouter);
schedule.scheduleJob("0 0 * * *	", dailyMail);

db.sync()
  .then((result) => {
    console.log("connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

// better use migrations
seedNoteTypes();

app.listen(process.env.PORT);
