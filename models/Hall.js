const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hallSchema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: 'Event' },
  hallNumber: { type: String, required: true },
  supervisor: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Hall', hallSchema); 
