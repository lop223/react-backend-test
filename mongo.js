import mongoose from "mongoose";
import "dotenv/config";

const url = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);
mongoose.connect(url);

const noteShema = new mongoose.Schema({
  content: String,
  important: Boolean,
});
const Note = mongoose.model("Note", noteShema);

const note = new Note({
  content: "HTML is easy",
  important: true,
});

note.save().then((response) => {
  console.log(`note saved -> ${note}`);
  mongoose.connection.close();
});
