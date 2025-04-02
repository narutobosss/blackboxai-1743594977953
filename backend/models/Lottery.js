const mongoose = require('mongoose');

const lotterySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

module.exports = mongoose.model('Lottery', lotterySchema);