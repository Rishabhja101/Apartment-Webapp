const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const deviceSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  states: {
    type: [String],
    required: true,
    trim: true
  }
}, {
  timestamps: true,
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;