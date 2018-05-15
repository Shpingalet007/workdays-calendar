import db from '../config/mongoose';

class Worker {
  static prepareData(data) {
    return _.omit(data, '_id', '__v');
  }

  getId(email) {
    return new Promise((resolve, reject) => {
      if (!email) return;

      db.Worker
        .findOne({ email }).lean()
        .then((workerInfo) => {
          if (!workerInfo) reject('Worker with so credentials not found!');

          resolve(workerInfo._id);
        });
    });
  }

  find({
    email,
    name,
    phone,
  }) {
    return new Promise((resolve, reject) => {
      function queryThen(data) {
        if (!data) reject('Worker with so credentials not found!');

        const prepData = Worker.prepareData(data);
        resolve(prepData);
      }

      if (email) {
        console.log(email);

        db.Worker
          .findOne({ email }).lean()
          .then(queryThen);
      }

      if (name) {
        console.log(name);

        db.Worker
          .findOne({ name }).lean()
          .then(queryThen);
      }

      if (phone) {
        console.log(phone);

        db.Worker
          .findOne({ phone }).lean()
          .then(queryThen);
      }
    });
  }

  create(data) {
    const prepData = _.compactObject(data);

    const checkedData = _.pick(prepData, [
      'name',
      'email',
      'phone',
      'info',
    ]);

    const worker = new db.Worker(checkedData);
    return new Promise((resolve, reject) => {
      worker.save((err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  remove(data) {
    const prepData = _.compactObject(data);

    const checkedData = _.pick(prepData, [
      'id',
      'name',
      'email',
    ]);

    const firstKey = _.keys(checkedData)[0];
    const query = _.pick(checkedData, firstKey);

    return new Promise((resolve, reject) => {
      db.Worker.findOneAndRemove(query)
        .exec()
        .then((workerInfo) => {
          if (!workerInfo) reject('Worker with so credentials not found!');
          resolve(workerInfo);
        });
    });
  }

  edit(query, data) {
    const queryIsEmpty = _.isEmpty(_.compactObject(query));

    if (queryIsEmpty) return false;

    // Preparing query
    const prepQuery = _.compactObject(query);

    const checkedQuery = _.pick(prepQuery, [
      'email',
    ]);

    // Preparing data
    const prepData = _.compactObject(data);

    const checkedData = _.pick(prepData, [
      'name',
      'email',
      'phone',
      'info',
    ]);

    return new Promise((resolve, reject) => {
      db.Worker.findOneAndUpdate(checkedQuery, checkedData)
        .then((result) => {
          if (!result) reject({
            message: 'No worker found!',
            code: 404,
          });
          resolve(result);
        }, (error) => {
          reject(error);
        });
    });
  }
}

const worker = new Worker();

class Spend {
  find({
    email,
    date,
  }) {
    return new Promise((resolve, reject) => {
      db.Spending.find({
        date,
      }).populate({
        path: 'worker',
        email,
      }).then((spendInfo) => {
        if (!spendInfo || spendInfo.length === 0) {
          reject('Time spend record with so credentials not found!');
        }

        resolve(spendInfo);
      });
    });
  }

  create(data) {
    if (!data.email) return;

    const email = data.email;
    const prepData = _.compactObject(data);

    const checkedData = _.pick(prepData, [
      'date',
      'efficiency',
    ]);

    return new Promise((resolve, reject) => {
      worker.getId(email)
        .then((workerId) => {
          checkedData.worker = workerId;

          db.Spending.count({
            worker: workerId,
            date: data.date,
          }).then((exists) => {
            if (exists) {
              reject({
                message: 'There is a record for selected worker and date!',
                code: 400,
              });

              return;
            }

            const spend = new db.Spending(checkedData);
            spend.save((err) => {
              if (err) reject(err);
              resolve('Spend time record added successfully!');
            });
          });
        });
    });
  }

  edit(query, {
    email,
    date,
    efficiency,
  }) {
    return new Promise((resolve, reject) => {
      // Preparing data
      const prepQuery = _.compactObject(query);

      const checkedQuery = _.pick(prepQuery, ['date']);

      const valuesForUpdate = {};

      if (date) valuesForUpdate.date = date;
      if (efficiency) valuesForUpdate.efficiency = efficiency;

      if (!_.isEmpty(valuesForUpdate)) {
        db.Spending.findOneAndUpdate(checkedQuery, valuesForUpdate)
          .populate({
            path: 'worker',
            email,
          })
          .then((result) => {
            if (!result) reject('No spend time record found!');
            resolve(result);
          }, (error) => {
            reject(error.message);
          });
      }
    });
  }

  remove(data) {
    if (!_.has(data, 'email')) return;

    const prepData = _.compactObject(data);

    const checkedData = _.pick(prepData, [
      'date',
    ]);

    return new Promise((resolve, reject) => {
      db.Spending.findOneAndRemove(checkedData).populate({
        path: 'worker',
        email: data.email,
      }).then((spendInfo) => {
        if (!spendInfo) reject('Time spend not found!');
        resolve(spendInfo);
      });
    });
  }
}

const spend = new Spend();

export default {
  worker,
  spend,
};
