import express from "express";
import cors from "cors";

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true,
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["PUT", "GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.get("/", (request, response) => {
  response.send("<h1>Hello Wolrld!</h1>");
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
