import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const WorkerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    maxlength: 11,
  },
  info: {
    type: String,
    maxlength: 500,
  },
});

const WorkerModel = mongoose.model('Worker', WorkerSchema);

export default WorkerModel;
