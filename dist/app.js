"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DBConfig_1 = __importDefault(require("./DBConfig"));
const cors_1 = __importDefault(require("cors"));
const node_schedule_1 = __importDefault(require("node-schedule"));
const dotenv = __importStar(require("dotenv"));
const body_parser_1 = __importStar(require("body-parser"));
const user_1 = __importDefault(require("./routes/user"));
const auth_1 = __importDefault(require("./routes/auth"));
const seed_1 = __importDefault(require("./middleware/seed"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const daily_mail_1 = __importDefault(require("./Notifications/daily-mail"));
dotenv.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.options("*", (0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use((0, body_parser_1.urlencoded)({ extended: true }));
const storage = multer_1.default.diskStorage({
    destination: "./files",
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
    },
});
app.use((0, multer_1.default)({ storage, limits: { fileSize: 1024 * 1024 * 1.7 } }).any());
app.use(express_1.default.static(path_1.default.join(__dirname, "files")));
app.use(user_1.default);
app.use(auth_1.default);
node_schedule_1.default.scheduleJob("* * * * *	", daily_mail_1.default);
DBConfig_1.default.sync()
    .then((result) => {
    console.log("connected successfully");
})
    .catch((err) => {
    console.log(err);
});
// using migrations
(0, seed_1.default)();
app.listen(process.env.PORT);
