import parseDate from '../../config/dateParser';
import timeStock from '../../classes/TimeStocktaking';
import jsonAnswer from '../../classes/jsonAnswer';

function readTimespendRecordRoute({ body }, res) {
  // Input checks
  if (!_.isObject(body)) jsonAnswer.warn(res, 'Body is not JSON!');

  const json = _.compactObject(body);

  if (!_.has(json, 'email')) jsonAnswer.warn(res, 'Email required!');
  if (!_.has(json, 'date')) jsonAnswer.warn(res, 'Date required!');

  // Prepared data
  const dataPrep = _.pick(json, [
    'email',
  ]);

  dataPrep.date = parseDate(json.date);

  // Sending request
  timeStock.Spend.find(dataPrep)
    .then((result) => {
      jsonAnswer.success(res, result);
    }, (error) => {
      jsonAnswer.warn(res, error);
    });
}

export default readTimespendRecordRoute;
