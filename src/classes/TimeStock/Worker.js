import db from '../../config/mongoose';
import DataEvent from '../DataEvent';

class Worker {
  static prepareData(data) {
    return _.omit(data, '_id', '__v');
  }

  static async getId(email) {
    const workerData = await db.Worker.findOne({ email });

    if (_.isEmpty(workerData)) throw DataEvent.DBAssocNotFound('Worker');

    return workerData._id;
  }

  static async isExist(email) {
    const workerData = await db.Worker.findOne({ email });

    if (!_.isEmpty(workerData)) return true;
  }

  static async find({
    email,
  }) {
    const prepData = {
      email,
    };

    // Stage 1: Get Worker data
    const workerData = await db.Worker.findOne(prepData)
      .select('-_id -__v');

    if (_.isEmpty(workerData)) {
      throw DataEvent.DBNotFound('Worker');
    }

    return DataEvent.DBSuccess(workerData, 'Worker');
  }

  static async create({
    name,
    email,
    phone,
    info,
  }) {
    const prepData = {
      name,
      email,
    };

    if (phone) prepData.phone = phone;
    if (info) prepData.info = info;

    // Stage 1: Check if Worker exists. Error control inside.
    const workerExist = await Worker.isExist(email);

    if (workerExist) throw DataEvent.DBNotUniqueRec('Worker');

    // Stage 2: Creating Worker
    let worker = new db.Worker(prepData);
    worker = await worker.save();

    if (_.isEmpty(worker)) throw DataEvent.DBNotCreated('Worker');

    return DataEvent.DBSuccessCreate(worker, 'Worker');
  }

  static async remove({
    email,
  }) {
    const prepData = {
      email,
    };

    const workerData = await db.Worker.findOneAndRemove(prepData);

    if (_.isEmpty(workerData)) {
      throw DataEvent.DBNotFound('Worker');
    }

    return DataEvent.DBSuccessRemove(workerData, 'Worker');
  }

  static async edit(query, {
    name,
    email,
    phone,
    info,
  }) {
    const prepQuery = query;

    const prepData = {};

    if (name) prepData.name = name;
    if (email) prepData.email = email;
    if (phone) prepData.phone = phone;
    if (info) prepData.info = info;

    // Stage 1: Checking if no Worker with new email provided
    const workerExist = await Worker.isExist(email);

    if (workerExist) throw DataEvent.DBNotUniqueRec('Worker');

    // Stage 2: Editing Worker
    const workerData = await db.Worker.findOneAndUpdate(prepQuery, prepData);

    if (_.isEmpty(workerData)) throw DataEvent.DBNotFound('Worker');

    return DataEvent.DBSuccessUpdate(workerData, 'Worker');
  }
}

export default Worker;
