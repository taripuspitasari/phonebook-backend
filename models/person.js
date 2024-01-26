const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [5, "Minimum name length is 5 characters"],
    required: [true, "Enter a name"],
  },
  number: {
    type: String,
    minlength: [8, "Minimum number length is 8 characters"],
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
