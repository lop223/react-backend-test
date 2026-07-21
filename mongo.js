import mongoose from "mongoose";

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb://admin:${password}@localhost:27017/notesdb?authSource=admin`;
mongoose.set("strictQuery", false);
mongoose.connect(url);

const noteShema = new mongoose.Schema({
  content: String,
  important: Boolean,
});
const Note = mongoose.model("Note", noteShema);

Note.find({}).then((response) => {
  response.forEach((note) => console.log(note));
  mongoose.connection.close();
});
