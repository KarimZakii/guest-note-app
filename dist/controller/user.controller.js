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
exports.test = exports.deleteNote = exports.latestNotes = exports.sendNote = void 0;
const notes_model_1 = __importDefault(require("../models/notes.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const notes_type_model_1 = require("../models/notes-type.model");
const sequelize_1 = require("sequelize");
const DBConfig_1 = __importDefault(require("../DBConfig"));
const mail_options_1 = __importDefault(require("../Notifications/mail-options"));
const sendmail_1 = require("../Notifications/sendmail");
const sendNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { usersIds, noteTitle, noteMessageBody, noteTypeId } = req.body;
        usersIds.map((user) => +user);
        var files = [];
        var fileKeys = Object.keys(req.files);
        fileKeys.forEach(function (key) {
            files.push(req.files[key]);
        });
        const filesPaths = files.map((file) => {
            return file.path;
        });
        const noteMediaFiles = filesPaths.join(",");
        const typeId = yield notes_type_model_1.NoteTypes.findOne({ where: { id: noteTypeId } });
        if (!typeId) {
            return res.status(404).json({ error: "This note type does not exist" });
        }
        const notesArr = [];
        usersIds.forEach((userId) => {
            const note = {
                UserId: userId,
                title: noteTitle,
                body: noteMessageBody,
                noteMediaFiles: noteMediaFiles,
                NoteTypeId: noteTypeId,
            };
            notesArr.push(note);
        });
        let createdNotes;
        yield DBConfig_1.default.transaction((transaction) => __awaiter(void 0, void 0, void 0, function* () {
            createdNotes = yield notes_model_1.default.bulkCreate(notesArr, { transaction });
        }));
        const users = yield user_model_1.default.findAll({
            attributes: ["email"],
            where: { id: usersIds },
        });
        const emails = users.map((user) => user.dataValues.email);
        const mailOption = (0, mail_options_1.default)(emails, "new note", "new note", "you recieved a new note");
        (0, sendmail_1.sendMail)(mailOption);
        return res.status(200).send("notes sent successfully");
    }
    catch (e) {
        return res.json({ error: e.message });
    }
});
exports.sendNote = sendNote;
const latestNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decodedToken = req.token;
        const userId = decodedToken.id;
        const currentDate = new Date();
        const thirtyDaysAgo = new Date();
        const page = +req.query.page || 1;
        const notesTypesIds = req.query.filter || null;
        const notesPerPage = 10;
        const offset = (page - 1) * notesPerPage;
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const filterednotesQuery = {
            where: {
                createdAt: {
                    [sequelize_1.Op.between]: [thirtyDaysAgo, currentDate],
                },
                UserId: userId,
                deleted: false,
            },
            include: [
                {
                    model: notes_type_model_1.NoteTypes,
                    where: {
                        [sequelize_1.Op.and]: [{ disabled: false }, { id: notesTypesIds }],
                    },
                    attributes: ["type"],
                },
            ],
            limit: notesPerPage,
            offset: offset,
        };
        const notesQuery = {
            where: {
                createdAt: {
                    [sequelize_1.Op.between]: [thirtyDaysAgo, currentDate],
                },
                UserId: userId,
                deleted: false,
            },
            include: [
                {
                    model: notes_type_model_1.NoteTypes,
                    where: { disabled: false },
                    attributes: ["type"],
                },
            ],
            limit: notesPerPage,
            offset: offset,
        };
        if (notesTypesIds) {
            const notes = yield notes_model_1.default.findAll(filterednotesQuery);
            return res.status(200).json({ notes });
        }
        else {
            const notes = yield notes_model_1.default.findAll(notesQuery);
            return res.status(200).json({ notes });
        }
    }
    catch (e) {
        return res.json({ error: e.message });
    }
});
exports.latestNotes = latestNotes;
const deleteNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decodedToken = req.token;
        const UserId = decodedToken.id;
        const notesIds = req.body.notesIds;
        const updatedNotes = yield notes_model_1.default.update({
            deleted: true,
        }, {
            where: {
                id: notesIds,
                UserId,
            },
        });
        return res.json({ message: "Notes Deleted Successfully" });
    }
    catch (e) {
        return res.json({ error: e.message });
    }
});
exports.deleteNote = deleteNote;
const test = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({
        attributes: ["email"],
        where: { id: 1 },
    });
    console.log(user.dataValues.email);
});
exports.test = test;
