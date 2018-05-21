import parseDate from '../../config/dateParser';
import timeStock from '../../classes/TimeStocktaking';
import jsonAnswer from '../../classes/jsonAnswer';

function statsTimespendRecordsRoute({ body }, res) {
  // Input checks
  if (!_.isObject(body)) jsonAnswer.warn(res, 'Body is not JSON!');

  const json = _.compactObject(body);

  if (!_.has(json, 'emails')) jsonAnswer.warn(res, 'Emails required!');
  if (!_.has(json, 'dates')) jsonAnswer.warn(res, 'Dates required!');

  // Prepared data
  const dataPrep = _.pick(json, [
    'emails',
    'statuses',
    'datesAreRange',
  ]);

  dataPrep.dates = json.dates
    .map(date => parseDate(date));

  // Sending request
  timeStock.Spend.stats(dataPrep)
    .then((result) => {
      jsonAnswer.success(res, result);
    }, (error) => {
      jsonAnswer.warn(res, error);
    });
}

export default statsTimespendRecordsRoute;
