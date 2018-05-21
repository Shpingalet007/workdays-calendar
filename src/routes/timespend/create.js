import parseDate from '../../config/dateParser';
import timeStock from '../../classes/TimeStocktaking';
import jsonAnswer from '../../classes/jsonAnswer';

function createTimespendRecordRoute({ body }, res) {
  // Input checks
  if (!_.isObject(body)) return jsonAnswer.warn(res, 'Body is not JSON!');

  const json = _.compactObject(body);

  if (!_.has(json, 'email')) return jsonAnswer.warn(res, 'Email required!');
  if (!_.has(json, 'status')) return jsonAnswer.warn(res, 'Status required!');

  // Prepared data
  const dataPrep = _.pick(json, [
    'email',
    'status',
    'efficiency',
  ]);

  dataPrep.date = parseDate(json.date);

  // Sending request
  timeStock.Spend.create(dataPrep)
    .then((result) => {
      jsonAnswer.success(res, result);
    }, (error) => {
      jsonAnswer.warn(res, error);
    });
}

export default createTimespendRecordRoute;
