import _ from './config/underscore';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';

// Importing Worker routes for express router
import createWorkerRoute from './routes/worker/create';
import readWorkerRoute from './routes/worker/read';
import updateWorkerRoute from './routes/worker/update';
import deleteWorkerRoute from './routes/worker/delete';

// Importing timespend routes for express router
import createTimespendRecordRoute from './routes/timespend/create';
import readTimespendRecordRoute from './routes/timespend/read';
import updateTimespendRecordRoute from './routes/timespend/update';
import deleteTimespendRecordRoute from './routes/timespend/delete';
import readTimespendRecordsRoute from './routes/timespend/list';
import statsTimespendRecordsRoute from './routes/timespend/stats';

// Transforming Underscore to global
global._ = _;

const app = express();

const PORT = 4080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(compression({
  threshold: 1,
}));

const router = express.Router();

// Worker CRUD operations
router.post('/Worker', createWorkerRoute);
router.get('/Worker', readWorkerRoute);
router.put('/Worker', updateWorkerRoute);
router.delete('/Worker', deleteWorkerRoute);

// Time spend CRUD operations
router.post('/timespend', createTimespendRecordRoute);
router.get('/timespend', readTimespendRecordRoute);
router.put('/timespend', updateTimespendRecordRoute);
router.delete('/timespend', deleteTimespendRecordRoute);

// Time spends mass operations
router.get('/timespends', readTimespendRecordsRoute);
router.get('/timespends/stats', statsTimespendRecordsRoute);

app.use('/api', router);
app.listen(PORT);
