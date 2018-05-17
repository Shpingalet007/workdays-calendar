import _ from './config/underscore';
import express from 'express';
import bodyParser from 'body-parser';

// Importing worker routes for express router
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
import retrieveTimespendReportRoute from './routes/timespend/stats';

// Transforming Underscore to global
global._ = _;

const app = express();

const PORT = 4080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const router = express.Router();

// Worker CRUD operations
router.post('/worker', createWorkerRoute);
router.get('/worker', readWorkerRoute);
router.put('/worker', updateWorkerRoute);
router.delete('/worker', deleteWorkerRoute);

// Time spend CRUD operations
router.post('/timeSpend', createTimespendRecordRoute);
router.get('/timespend', readTimespendRecordRoute);
router.put('/timespend', updateTimespendRecordRoute);
router.delete('/timespend', deleteTimespendRecordRoute);

// Time spends mass operations
router.get('/timespends', readTimespendRecordsRoute);
router.get('/timespends/stats', retrieveTimespendReportRoute);

app.use('/api', router);
app.listen(PORT);