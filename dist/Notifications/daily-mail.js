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
const notes_type_model_1 = require("../models/notes-type.model");
const notes_model_1 = __importDefault(require("../models/notes.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const mail_options_1 = __importDefault(require("./mail-options"));
const sendmail_1 = require("./sendmail");
const dailyMail = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        function countIdsByType(object) {
            const typeCounts = {};
            for (const item of Object.values(object)) {
                const { id, type } = item;
                if (typeCounts[type]) {
                    typeCounts[type]++;
                }
                else {
                    typeCounts[type] = 1;
                }
            }
            return typeCounts;
        }
        const users = yield user_model_1.default.findAll({
            attributes: ["id"],
            where: {
                notifications: true,
            },
        });
        const usersIds = users.map((user) => user.dataValues.id);
        usersIds.forEach((userId) => __awaiter(void 0, void 0, void 0, function* () {
            const notes = yield notes_model_1.default.findAll({
                attributes: ["id"],
                where: { UserId: userId, seen: false, deleted: false },
                include: [{ model: notes_type_model_1.NoteTypes, attributes: ["type"] }],
            });
            const notesTypes = notes.map((note) => {
                return {
                    id: note.dataValues.id,
                    type: note.dataValues.NoteType.dataValues.type,
                };
            });
            const result = countIdsByType(notesTypes);
            let output = "you have ";
            for (const key in result) {
                output += `${result[key]} ${key}, `;
            }
            output = output.slice(0, -2);
            output += " notes";
            const user = yield user_model_1.default.findOne({
                attributes: ["email"],
                where: { id: userId },
            });
            const email = user.dataValues.email;
            const emailOptions = (0, mail_options_1.default)([email], "Daily Notes", "Your Daily reminder of new notes", output);
            (0, sendmail_1.sendMail)(emailOptions);
        }));
    }
    catch (error) {
        console.error("Error sending user notifications:", error);
    }
});
exports.default = dailyMail;
