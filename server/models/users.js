const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  user: String,
  names: {
    type: Array
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
