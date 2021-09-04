const mongoose = require("mongoose");

const snippetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  subject: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
});
const snippet = mongoose.model("snippet", snippetSchema);
module.exports = snippet;
