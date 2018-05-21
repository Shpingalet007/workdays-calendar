import db from '../../config/mongoose';
import DataEvent from '../DataEvent';

class Status {
  static async getId(title) {
    const statusData = await db.Status.findOne({ title });

    if (_.isEmpty(statusData)) throw DataEvent.DBAssocNotFound('Status');

    return statusData._id;
  }
}

export default Status;
