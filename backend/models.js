const mongoose = require('mongoose');

const ClickSchema = new mongoose.Schema({
  count: {
    type: Number,
    default: 0,
    required: true,
  },
  session: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Click = mongoose.model('Click', ClickSchema);

module.exports = { Click };
