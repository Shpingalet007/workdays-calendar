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
          if (!result) {
            reject({
              message: 'No worker found!',
              code: 404,
            });
          }
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
    if (!data.status) return;

    const email = data.email;
    const status = data.status;
    const prepData = _.compactObject(data);

    const checkedData = _.pick(prepData, [
      'date',
      'efficiency',
    ]);

    return new Promise((resolve, reject) => {
      worker.getId(email)
        .then((workerId) => {
          checkedData.worker = workerId;

          return db.Spending.count({
            worker: workerId,
            date: data.date,
          });
        })
        .then((exists) => {
          if (exists) {
            reject({
              message: 'There is a record for selected worker and date!',
              code: 400,
            });

            return;
          }

          return db.Status.findOne({
            title: status,
          });
        })
        .then((status) => {
          checkedData.status = status._id;

          const spend = new db.Spending(checkedData);
          spend.save((err) => {
            if (err) reject(err);
            resolve('Spend time record added successfully!');
          });
        });
    });
  }

  edit(query, {
    email,
    date,
    efficiency,
    status,
  }) {
    function proceedUpdate(status) {
      if (status) valuesForUpdate.status = status._id;

      if (!_.isEmpty(valuesForUpdate)) {
        db.Spending.findOneAndUpdate(checkedQuery, valuesForUpdate)
          .populate({
            path: 'worker',
            email,
          })
          .populate({
            path: 'status',
            title: status,
          })
          .then((result) => {
            if (!result) reject('No spend time record found!');
            resolve(result);
          }, (error) => {
            reject(error.message);
          });
      }
    }

    return new Promise((resolve, reject) => {
      // Preparing data
      const prepQuery = _.compactObject(query);

      const checkedQuery = _.pick(prepQuery, ['date']);

      const valuesForUpdate = {};

      if (date) valuesForUpdate.date = date;
      if (efficiency) valuesForUpdate.efficiency = efficiency;
      if (status) {
        db.Status.findOne({
          title: status,
        }).then(proceedUpdate);

        return true;
      }

      proceedUpdate();
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

  list({
    emails,
    dates,
    statuses,
    datesAreRange,
    optimized,
    noKeys,
    onlyStats,
  }) {
    function optimizeData(data) {
      function getWorkers(data) {
        const uniqueIds = [];

        let workers = data.map((timeSpend) => {
          const worker = timeSpend.worker;

          // Short function to find unique id's
          const isUnique = (id) => {
            const found = _.find(uniqueIds, uniqueId => (uniqueId === id));
            return (found === undefined);
          };

          if (isUnique(worker._id) !== false) {
            uniqueIds.push(worker._id);
            return worker;
          }
        });

        workers = _.compact(workers);

        const workersObj = {};
        workers.map((worker) => {
          console.log(worker);
          workersObj[worker._id] = _.omit(worker, '_id');
        });

        return workersObj;
      }
      function removeWorkersFullData(data) {
        const copyData = data;

        copyData.map((val, i) => {
          copyData[i].worker = copyData[i].worker._id;
        });

        return copyData;
      }

      const workers = getWorkers(data);
      const timespends = removeWorkersFullData(data);

      return {
        timespends,
        workers,
      };
    }
    function useArrays(data) {
      const timespends = data.timespends
        .map(timespend => _.values(timespend));

      const workers = _.mapObject(data.workers, worker => _.values(worker));

      return {
        timespends,
        workers,
      };
    }

    let datesQuery;

    if (dates.length === 2 && datesAreRange) datesQuery = { $gt: dates[0], $lt: dates[1] };
    else if (dates.length > 2 || !datesAreRange) datesQuery = { $in: dates };

    return new Promise((resolve, reject) => {
      db.Spending.find({
        date: datesQuery,
      }).populate({
        path: 'worker',
        select: '-__v',
      }).populate({
        path: 'status',
        select: '-__v',
      }).select('-_id -__v')
        .sort('date')
        .lean()
        .then((result) => {
          function genStatistics(data) {
            // Группировка по работникам
            const workersSpends = {};
            emails.map((email) => {
              workersSpends[email] = data.map((timespend) => {
                if (timespend.worker.email === email) {
                  return _.omit(timespend, 'worker');
                }
              });
              workersSpends[email] = _.compact(workersSpends[email]);
            });

            // Группировка по статусам
            const groupedSpends = {};
            statuses.map((status) => {
              groupedSpends[status] = _.mapObject(workersSpends, (workerTimespends, key) => {
                let workerSpends = {};

                workerSpends = workerTimespends.map((timespend) => {
                  if (timespend.status.title === status) return timespend;
                });

                return _.compact(workerSpends);
              });
            });

            // Подсчёт рабочего времени
            const workersCounters = {};
            _.map(groupedSpends, (workers, status) => {
              _.map(workers, (timespends, worker) => {
                timespends.map((timespend) => {
                  if (!workersCounters[worker]) workersCounters[worker] = {};
                  if (!workersCounters[worker][status]) workersCounters[worker][status] = 0;

                  workersCounters[worker][status] += timespend.efficiency;
                });
              });
            });

            return workersCounters;
          }

          let resultPrep = result;
          if (optimized) {
            resultPrep = optimizeData(resultPrep);

            if (noKeys) resultPrep = useArrays(resultPrep);
          }

          if (onlyStats) resultPrep = genStatistics(result);


          resolve(resultPrep);
        }, (error) => {
          reject(error);
        });
    });
  }

  // TODO: Delete this...
  generateReport({
    emails,
    dates,
    datesAreRange,
  }) {
    // Подготовка запроса по электронной почте
    let emailsQuery;

    if (!Array.isArray(emails)) emailsQuery = emails;
    else if (emails.length >= 2) emailsQuery = { $in: emails };

    // Подготовка запроса по дате
    let datesQuery;

    if (!Array.isArray(dates)) datesQuery = dates;
    else if (dates.length === 2 && datesAreRange) datesQuery = { $gt: dates[0], $lt: dates[1] };
    else if (dates.length > 2 || !datesAreRange) datesQuery = { $in: dates };

    console.log(datesAreRange, datesQuery);

    return new Promise((resolve, reject) => {
      db.Spending.find({
        date: datesQuery,
      }).populate({
        path: 'worker',
        email: emailsQuery,
      }).then((result) => {
        resolve(result);
      }, (error) => {
        reject(error);
      });
    });
  }
}

const spend = new Spend();

export default {
  worker,
  spend,
};
