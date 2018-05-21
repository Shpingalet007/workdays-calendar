import parseDate from '../../config/dateParser';
import timeStock from '../../classes/TimeStocktaking';
import jsonAnswer from '../../classes/jsonAnswer';

function updateTimespendRecordRoute({ body }, res) {
  // Input checks
  if (!_.isObject(body)) return jsonAnswer.warn(res, 'Body is not JSON!');

  const json = _.compactObject(body);

  if (!_.has(json, 'query')) return jsonAnswer.warn(res, 'Query parameters required!');
  if (!_.has(json.query, 'email')) return jsonAnswer.warn(res, 'Query email required!');
  if (!_.has(json.query, 'date')) return jsonAnswer.warn(res, 'Query date required!');

  if (_.isEmpty(json.update)) return jsonAnswer.warn(res, 'Update parameters required!');

  // Prepared data
  const queryPrep = json.query;
  const updatePrep = json.update;

  // Converting dates
  queryPrep.date = parseDate(queryPrep.date);
  updatePrep.date = parseDate(updatePrep.date);

  // Sending request
  timeStock.Spend.edit(queryPrep, updatePrep)
    .then((result) => {
      jsonAnswer.success(res, result);
    }, (error) => {
      jsonAnswer.warn(res, error);
    });
}

export default updateTimespendRecordRoute;
