interface sendNoteDto {
  usersIds: [number];
  noteTitle: string;
  noteMessageBody: string;
  noteTypeId: number;
}

export default sendNoteDto;
