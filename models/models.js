const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  filepath: {
    type: String,
    required: true,
  },
  file: {
    type: String,
  },
});

module.exports = new mongoose.model("files", schema);
