import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const WorkerSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  info: String,
});

const WorkerModel = mongoose.model('Worker', WorkerSchema);

export default WorkerModel;
