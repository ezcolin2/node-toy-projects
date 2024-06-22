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
})
export default mongoose.model('Room', roomSchema)