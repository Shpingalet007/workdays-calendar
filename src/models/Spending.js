import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const SpendingSchema = new Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  worker: {
    type: Schema.Types.ObjectId,
    ref: 'Worker',
    required: true,
  },
  status: {
    type: Schema.Types.ObjectId,
    ref: 'Status',
  },
  efficiency: {
    type: Number,
    default: 1,
    max: 1,
  },
  info: String,
});

const SpendingModel = mongoose.model('Spending', SpendingSchema);

export default SpendingModel;
