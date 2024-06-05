import mongoose from 'mongoose';

const { Schema } = mongoose;

const roomSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  master: {
    type: String,
    required: true
  }
});

const Room = mongoose.model('Room', roomSchema);

export default Room;
