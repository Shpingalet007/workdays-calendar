import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const StatusSchema = new Schema({
  title: String,
});

const StatusModel = mongoose.model('Status', StatusSchema);

export default StatusModel;
