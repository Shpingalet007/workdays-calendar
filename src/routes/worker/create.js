import timeStock from '../../classes/TimeStocktaking';
import jsonAnswer from '../../classes/jsonAnswer';

function createWorkerRoute({ body }, res) {
  // Input checks
  if (!_.isObject(body)) return jsonAnswer.warn(res, 'Body is not JSON!');

  const json = _.compactObject(body);

  if (!_.has(json, 'name')) return jsonAnswer.warn(res, 'Name required!');
  if (!_.has(json, 'email')) return jsonAnswer.warn(res, 'Email required!');

  // Prepared data
  const dataPrep = _.pick(json, [
    'name',
    'email',
    'phone',
    'info',
  ]);

  timeStock.Worker.create(dataPrep)
    .then((result) => {
      jsonAnswer.success(res, result);
    }, (error) => {
      jsonAnswer.warn(res, error);
    });
}

export default createWorkerRoute;
