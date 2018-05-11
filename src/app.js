import express from 'express';
import {
  Worker,
  Spending,
  Status,
  mongoose,
} from './config/mongoose.js';

mongoose.connection.once('open', () => {
  console.log('Connection to database established');
});

