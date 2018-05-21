import timeStock from '../../classes/TimeStocktaking';
import jsonAnswer from '../../classes/jsonAnswer';

function updateWorkerRoute({ body }, res) {
  // Input checks
  if (!_.isObject(body)) return jsonAnswer.warn(res, 'Body is not JSON!');

  const json = _.compactObject(body);

  if (!_.has(json, 'query')) return jsonAnswer.warn(res, 'Query parameters required!');
  if (!_.has(json.query, 'email')) return jsonAnswer.warn(res, 'Query email required!');

  if (!_.has(json, 'update')) return jsonAnswer.warn(res, 'Update parameters required!');

  // Prepared data
  const queryPrep = _.pick(json.query, ['email']);
  const dataPrep = _.pick(json.update, [
    'name',
    'email',
    'phone',
    'info',
  ]);

  // Sending request
  timeStock.Worker.edit(queryPrep, dataPrep)
    .then((result) => {
      jsonAnswer.success(res, result);
    }, (error) => {
      jsonAnswer.warn(res, error);
    });
}

export default updateWorkerRoute;
