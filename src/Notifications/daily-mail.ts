import { NoteTypes } from "../models/notes-type.model";
import Notes from "../models/notes.model";
import User from "../models/user.model";
import mailOptions from "./mail-options";
import { sendMail } from "./sendmail";

const dailyMail = async () => {
  try {
    function countIdsByType(object) {
      const typeCounts = {};

      for (const item of Object.values(object)) {
        const { id, type } = item as { id; type };

        if (typeCounts[type]) {
          typeCounts[type]++;
        } else {
          typeCounts[type] = 1;
        }
      }

      return typeCounts;
    }

    const users = await User.findAll({
      attributes: ["id"],
      where: {
        notifications: true,
      },
    });
    const usersIds = users.map((user) => user.dataValues.id);
    usersIds.forEach(async (userId) => {
      const notes = await Notes.findAll({
        attributes: ["id"],
        where: { UserId: userId, seen: false, deleted: false },
        include: [{ model: NoteTypes, attributes: ["type"] }],
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

      const user = await User.findOne({
        attributes: ["email"],
        where: { id: userId },
      });
      const email = user.dataValues.email;
      const emailOptions = mailOptions(
        [email],
        "Daily Notes",
        "Your Daily reminder of new notes",
        output
      );
      sendMail(emailOptions);
    });
  } catch (error) {
    console.error("Error sending user notifications:", error);
  }
};
export default dailyMail;
