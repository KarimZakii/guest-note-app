"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
/* REGISTER USER */
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, email } = req.body;
        if (!req.files) {
            return res.status(400).json({ error: "Files not found in the request" });
        }
        const profilePicURL = req.files[0].path;
        const salt = yield bcrypt_1.default.genSalt();
        const passwordHash = yield bcrypt_1.default.hash(password, salt);
        const newUser = new user_model_1.default({
            username,
            password: passwordHash,
            profilePicURL,
            email,
        });
        const savedUser = yield newUser.save();
        res.json(savedUser);
    }
    catch (error) {
        res.json({ error: error.message });
    }
});
exports.register = register;
/* LOGIN */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield user_model_1.default.findOne({ where: { username } });
        if (!user)
            return res.status(400).json({ message: "User does not exist." });
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials." });
        const token = jsonwebtoken_1.default.sign({ id: user.id }, "Y0u-Kn0w-517-H4pp3n5-50m371m35-3v3n-7h0u9h-W3-W15h-1t-D1d-N07-6u7-W3-4r3-H3r3-70-H3lp-H0w3v3r-W3-C4n");
        res
            .status(200)
            .json({ token, user: { username: user.username, _id: user.id } });
    }
    catch (error) {
        res.json({ error: error.message });
    }
});
exports.login = login;
