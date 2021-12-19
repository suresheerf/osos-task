const mongoose = require('mongoose');

const restaurentSchema = new mongoose.Schema({
  name: String,
  description: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  ratings: [Number]
});
restaurentSchema.index({ location: '2dsphere' });
const Restaurent = mongoose.model('Restaurent', restaurentSchema);

module.exports = Restaurent;
