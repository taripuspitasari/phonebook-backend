require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const Person = require("./models/person");

app.use(express.static("dist"));
app.use(express.json());
app.use(cors());

morgan.token("body", req => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [];

app.get("/", (request, response) => {
  response.send("<h1>Hello anak manies</h1>");
});

app.get("/info", (request, response) => {
  const people = persons.length;
  const date = new Date();
  response.send(
    `<p>Phonebook has info for ${people} people</p> <br/> <p>${date}</p>`
  );
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

const generatedId = () => {
  return Math.floor(Math.random() * 100);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  } else if (persons.findIndex(person => person.name === body.name) !== -1) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    id: generatedId(),
  });

  person.save().then(savedNote => {
    response.json(savedNote);
  });
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({error: "malformatted id"});
  }

  next(error);
};

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(errorHandler);
