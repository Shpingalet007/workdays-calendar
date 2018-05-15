import mongoose from 'mongoose';
import Worker from '../models/worker.js';
import Spending from '../models/spending.js';
import Status from '../models/spending.js';

// Database connection constants
const HOST = 'localhost';
const DATABASE = 'workdays';

// Trying to establish connection
mongoose.connect(`mongodb://${HOST}/${DATABASE}`);

// On db connection error
mongoose.connection.on(
  'error',
  console.error.bind(console, 'Connection to database error:'),
);

// On db connection success
mongoose.connection.once('open', () => {
  console.log('Connection to database established');
});

export default {
  Worker,
  Spending,
  Status,
};
