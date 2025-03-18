import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  steamPrice: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  genres: [{
    type: String,
    required: true
  }],
  platforms: [{
    type: String,
    required: true
  }],
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Game', gameSchema); 