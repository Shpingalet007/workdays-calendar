import mongoose from 'mongoose';
import Worker from '../models/worker.js';
import Spending from '../models/spending.js';
import Status from '../models/spending.js';

mongoose.connect('mongodb://localhost/workdays');

const dbConnection = mongoose.connection;

dbConnection.on(
  'error',
  console.error.bind(console, 'Connection to database error:'),
);

export default {
  Worker,
  Spending,
  Status,
  mongoose,
};
