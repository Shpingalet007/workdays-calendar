import timeStock from '../../classes/TimeStocktaking';
import jsonAnswer from '../../classes/jsonAnswer';

function readWorkerRoute({ body }, res) {
  // Input checks
  if (!_.isObject(body)) return jsonAnswer.warn(res, 'Body is not JSON!');

  const json = _.compactObject(body);

  if (!_.has(json, 'email')) return jsonAnswer.warn(res, 'Email required!');

  // Prepared data
  const dataPrep = _.pick(json, [
    'email',
  ]);

  timeStock.Worker.find(dataPrep)
    .then((result) => {
      jsonAnswer.success(res, result);
    }, (error) => {
      jsonAnswer.warn(res, error);
    });
}

export default readWorkerRoute;
