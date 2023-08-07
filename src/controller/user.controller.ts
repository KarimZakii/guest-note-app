import sendNoteDto from "../Dto's/sendNote.dto";
import Notes from "../models/notes.model";
import User from "../models/user.model";
import express from "express";
import { NoteTypes } from "../models/notes-type.model";
import { CustomRequest } from "../middleware/auth";
import { JwtPayload } from "jsonwebtoken";
import { Op } from "sequelize";
import db from "../DBConfig";
import mailOptions from "../Notifications/mail-options";
import { sendMail } from "../Notifications/sendmail";


export const sendNote: express.RequestHandler = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { usersIds, noteTitle, noteMessageBody, noteTypeId }: sendNoteDto =
      req.body;
    //usersIds.map((user) => +user);
    var files = [];
    var fileKeys = Object.keys(req.files);
    fileKeys.forEach(function (key) {
      files.push(req.files[key]);
    });
    const filesPaths = files.map((file) => {
      return file.path;
    });
    const noteMediaFiles = filesPaths.join(",");
    const typeId = await NoteTypes.findOne({ where: { id: noteTypeId } });
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
    await db.transaction(async (transaction) => {
      createdNotes = await Notes.bulkCreate(notesArr, { transaction });
    });

    const users = await User.findAll({
      attributes: ["email"],
      where: { id: usersIds },
    });
    const emails = users.map((user) => user.dataValues.email);

    const mailOption = mailOptions(
      emails,
      "new note",
      "new note",
      "you recieved a new note"
    );
    sendMail(mailOption);

    return res.status(200).send("notes sent successfully");
  } catch (e) {
    return res.json({ error: e.message });
  }
};

export const latestNotes: express.RequestHandler = async (
  req: CustomRequest,
  res: express.Response
) => {
  try {
    const decodedToken = req.token as JwtPayload;
    const userId: number = decodedToken.id;
    const currentDate = new Date();
    const thirtyDaysAgo = new Date();
    const page: number = +req.query.page || 1;
    const notesPerPage = 10;
    const offset = (page - 1) * notesPerPage;
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const filter = req.query.filter as string || null ;
    let notesTypes
    if(filter) {
       notesTypes = filter.split(",").map((item) => Number(item.trim()));
    }

    const filterednotesQuery = {
      where: {
        createdAt: {
          [Op.between]: [thirtyDaysAgo, currentDate],
        },
        UserId: userId,
        deleted: false,
      },
      include: [
        {
          model: NoteTypes,
          where: {
            [Op.and]: [{ disabled: false }, { id: notesTypes }],
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
          [Op.between]: [thirtyDaysAgo, currentDate],
        },
        UserId: userId,
        deleted: false,
      },
      include: [
        {
          model: NoteTypes,
          where: { disabled: false },
          attributes: ["type"],
        },
      ],
      limit: notesPerPage,
      offset: offset,
    };

    if (notesTypes) {
      const notes = await Notes.findAll(filterednotesQuery);
      return res.status(200).json({ notes });
    } else {
      const notes = await Notes.findAll(notesQuery);
      return res.status(200).json({ notes });
    }
  } catch (e) {
    return res.json({ error: e.message });
  }
};

export const deleteNote: express.RequestHandler = async (
  req: CustomRequest,
  res: express.Response
) => {
  try {
    const decodedToken = req.token as JwtPayload;
    const UserId: number = decodedToken.id;
    const notesIds: [number] = req.body.notesIds;
    const updatedNotes = await Notes.update(
      {
        deleted: true,
      },
      {
        where: {
          id: notesIds,
          UserId,
        },
      }
    );
    return res.json({ message: "Notes Deleted Successfully" });
  } catch (e) {
    return res.json({ error: e.message });
  }
};

