const personsRouter = require("express").Router();
const Person = require("../models/person");

let persons = [];

// personsRouter.get("/", (request, response) => {
//   response.send("<h1>Hello anak manies</h1>");
// });

// personsRouter.get("/info", (request, response) => {
//   const people = persons.length;
//   const date = new Date();
//   response.send(
//     `<p>Phonebook has info for ${people} people</p> <br/> <p>${date}</p>`
//   );
// });

personsRouter.get("/", (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons);
  });
});

personsRouter.get("/:id", (request, response, next) => {
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

personsRouter.delete("/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

personsRouter.post("/", (request, response) => {
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
    //   id: generatedId(),
  });

  person.save().then(savedNote => {
    response.json(savedNote);
  });
});

module.exports = personsRouter;
