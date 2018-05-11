import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const SpendingSchema = new Schema({
  date: Date,
  worker: {
    type: Schema.Types.ObjectId,
    ref: 'Worker',
  },
  status: {
    type: Schema.Types.ObjectId,
    ref: 'Status',
  },
  dayPart: {
    type: Number,
    default: 1,
  },
  info: String,
});

const SpendingModel = mongoose.model('Spending', SpendingSchema);

export default SpendingModel;
