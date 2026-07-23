import express, { request } from "express";
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
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/notes/:id", (request, response) => {
  Note.findByIdAndDelete(request.params.id)
    .then((result) => response.status(204).end())
    .catch((error) => next(error));
});

app.post("/api/notes", (request, response) => {
  const { content, important } = request.body;
  const note = new Note({
    content: content,
    important: important || false,
  });
  note
    .save()
    .then(response.json(note))
    .catch((error) => next(error));
});

app.put("/api/notes/:id", (request, response) => {
  const { content, important } = request.body;
  Note.findById(request.params.id)
    .then((note) => {
      if (!note) {
        response.status(404).end();
      }
      note.content = content;
      note.important = important;
      return note
        .save()
        .then((updatedNote) => response.json(updatedNote))
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name == "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if ((error.name = "ValidationError")) {
    return response.status(400).send({ error: error.message });
  }
  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
