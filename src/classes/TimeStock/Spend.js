import db from '../../config/mongoose';
import Worker from './Worker';
import Status from './Status';
import DataEvent from '../DataEvent';

class Spend {
  static async find({
    email,
    date,
  }) {
    const prepData = {
      date,
    };

    // Stage 1: Get Worker ID. Error control inside
    prepData.worker = await Worker.getId(email);

    // Stage 2: Get Timespend data
    const timespendData = await db.Spending.findOne(prepData)
      .select('-_id -__v')
      .populate({
        path: 'worker',
        select: '-_id -__v',
      })
      .populate({
        path: 'status',
        select: '-_id -__v',
      });

    if (_.isEmpty(timespendData)) {
      throw new DataEvent.DBNotFound('Timespend');
    }

    return DataEvent.DBSuccessFound(timespendData, 'Timespend');
  }

  static async create({
    email,
    status,
    date,
    efficiency,
  }) {
    const prepData = {
      date,
    };

    if (efficiency) prepData.efficiency = efficiency;

    // Stage 1: Get Worker ID. Error control inside
    prepData.worker = await Worker.getId(email);

    // Stage 2: Get status ID. Error control inside
    prepData.status = await Status.getId(status);

    // Stage 3: Check if there is timespend to Worker
    const timespendIsExist = await db.Spending
      .count(_.pick(prepData, ['worker', 'date']));

    if (timespendIsExist) throw DataEvent.DBNotUniqueRec('Timespend');

    // Stage 4: Create timespend record
    let timespend = new db.Spending(prepData);
    timespend = await timespend.save();

    if (_.isEmpty(timespend)) throw DataEvent.DBNotCreated('timespend');

    return DataEvent.DBSuccessCreate(timespend, 'Timespend');
  }

  static async edit(query, {
    email,
    date,
    efficiency,
    status,
  }) {
    // Preparing data
    let prepQuery = _.compactObject(query);
    prepQuery = _.pick(prepQuery, ['date', 'email']);

    // Stage 1: Get Worker ID for next query...
    const worker = await db.Worker.findOne({
      email: query.email,
    }, '_id');

    // Stage 2: Preparing incoming updated data...
    const dataForUpdate = {};

    // Getting new Worker ID
    if (email) {
      const workerData = await Worker.getId(email);

      // Throwing error if no data
      if (_.isEmpty(workerData)) {
        throw new DataEvent.DBAssocNotFound('Worker');
      }

      dataForUpdate.worker = workerData._id;
    }

    // Loading other data
    if (date) dataForUpdate.date = date;
    if (efficiency) dataForUpdate.efficiency = efficiency;

    // Getting new status ID
    if (status) {
      const statusData = await db.Status.findOne({
        title: status,
      }, '_id');

        // Throwing error if no data
      if (_.isEmpty(statusData)) {
        throw new DataEvent.DBAssocNotFound('Status');
      }

      dataForUpdate.status = statusData._id;
    }

    // Stage 3: Get all associated with Worker data...
    const timespend = await db.Spending.findOneAndUpdate({
      worker: worker._id,
      date: prepQuery.date,
    }, dataForUpdate)
      .select('-_id -__v')
      .populate({
        path: 'worker',
        select: '-_id -__v',
      })
      .populate({
        path: 'status',
        select: '-_id -__v',
      });

      // No timespend found error
    if (_.isEmpty(timespend)) {
      throw new DataEvent.DBNotFound('Timespend');
    }

    // Stage 4: Successfully returning data
    return DataEvent.DBSuccessUpdate(timespend, 'Timespend');
  }

  static async remove({
    email,
    date,
  }) {
    const prepData = {
      date,
    };

    // Stage 1: Get Worker ID. Error control inside
    prepData.worker = await Worker.getId(email);

    // Stage 2: Removing Timespend
    const removedTimespend = await db.Spending.findOneAndRemove(prepData)
      .select('-_id -__v')
      .populate({
        path: 'worker',
        select: '-_id -__v',
      })
      .populate({
        path: 'status',
        select: '-_id -__v',
      });

    if (_.isEmpty(removedTimespend)) {
      throw DataEvent.DBNotFound('Timespend');
    }

    return DataEvent.DBSuccessFound(removedTimespend, 'Timespend');
  }

  static async list({
    emails,
    dates,
    statuses,
    datesAreRange,
  }, returnArr) {
    // Preparing datesQuery
    let dateQuery;

    if (dates.length === 2 && datesAreRange) dateQuery = { $gt: dates[0], $lt: dates[1] };
    else if (dates.length > 2 || !datesAreRange) dateQuery = { $in: dates };
    else dateQuery = null;

    // Stage 1: Parsing from db associated with provided emails Workers ID's
    const query1 = (emails.length)
      ? { email: emails } : null;

    let workerQuery;

    if (query1) {
      const workerData = await db.Worker.find(query1);

      // Throwing error if no data or no enough data
      if (_.isEmpty(workerData)) throw DataEvent.DBAssocNotFound('workers');
      else if (workerData.length < emails.length) throw DataEvent.DBAssocSomeNotFound('workers');

      const workerIds = workerData.map(worker => worker._id);

      if (workerIds.length > 1) workerQuery = { $in: workerIds };
      else workerQuery = workerIds[0];
    } else {
      workerQuery = null;
    }

    // Stage 2: Parsing from db associated with provided statuses Status ID's
    const query2 = (statuses.length)
      ? { title: statuses } : null;

    let statusQuery;

    if (query2) {
      const statusData = await db.Status.find(query2);

      const statusIds = statusData.map(status => status._id);

      // Throwing error if no data or no enough data
      if (_.isEmpty(statusData)) throw DataEvent.DBAssocNotFound('statuses');
      else if (statusData.length < statuses.length) throw DataEvent.DBAssocSomeNotFound('statuses');

      if (statusIds.length > 1) statusQuery = { $in: statusIds };
      else statusQuery = statusIds[0];
    } else {
      statusQuery = null;
    }

    // Stage 3: Getting data about spends associated with Workers ID's and Status ID's
    const query3 = {};

    if (workerQuery) query3.worker = workerQuery;
    if (statusQuery) query3.status = statusQuery;
    if (dateQuery) query3.date = dateQuery;

    const timespendData = await db.Spending.find(query3)
      .select('-_id -__v')
      .populate({
        path: 'worker',
        select: 'email name -_id',
      })
      .populate({
        path: 'status',
        select: 'title -_id',
      });

    if (_.isEmpty(timespendData)) throw DataEvent.DBNotFound('Timespends');

    if (returnArr) return timespendData;

    return DataEvent.DBSuccessFound(timespendData, 'Timespends');
  }

  static async stats(data) {
    // Stage 1: Getting timespends
    const timespends = await Spend.list(data, true);

    const workers = {};

    timespends.map((timespend) => {
      const { email } = timespend.worker;
      const { title: status } = timespend.status;
      const { efficiency } = timespend;

      if (!workers[email]) workers[email] = {};
      if (!workers[email][status]) workers[email][status] = 0;

      workers[email][status] += efficiency;
    });

    return DataEvent.DBSuccess(workers, 'Statistics');
  }
}

export default Spend;
