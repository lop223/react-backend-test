import express from "express";
import mongoose from "mongoose";

import "dotenv/config";

import Note from "./models/note.js";

const app = express();
app.use(express.json());
app.use(express.static("dist"));

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => response.json(notes));
});

app.get("/api/notes/:id", (request, response) => {
  const id = request.params.id;

  const note = notes.find((note) => note.id === id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/notes/:id", (requset, response) => {
  const id = requset.params.id;
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((note) => Number(note.id))) : 0;
  return maxId + 1;
};

app.post("/api/notes", (requset, response) => {
  const body = requset.body;
  if (!body.content) {
    return response.status(400).json({ error: "missing content" });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  };
  notes.concat(note);
  console.log(note);
  response.json(note);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
