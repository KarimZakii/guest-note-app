import { notesTypes, NoteTypes } from "../models/notes-type.model";


async function seedNoteTypes() {
  try {
    const noteTypeValues = Object.values(notesTypes);
    for (const type of noteTypeValues) {
      const existingNoteType = await NoteTypes.findOne({ where: { type } });
      if (!existingNoteType) {
        await NoteTypes.create({ type });
      }
    }
    console.log("Note types seeded successfully!");
  } catch (error) {
    console.error("Error seeding note types:", error);
  }
}

export default seedNoteTypes;
