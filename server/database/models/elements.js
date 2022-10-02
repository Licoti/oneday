const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ElementSchema = new Schema({
  user: String,
  names: {
    type: Array
  }
});

const Element = mongoose.model('Element', ElementSchema);

module.exports = Element;
