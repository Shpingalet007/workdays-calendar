import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const StatusSchema = new Schema({
  title: String,
});

const StatusModel = mongoose.model('Status', StatusSchema);

let a = new StatusModel({
  title: 'На рабочем месте',
});
a.save();

export default StatusModel;
