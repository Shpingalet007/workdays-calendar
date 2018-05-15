import moment from 'moment';
import parseDate from '../../config/dateParser';
import timeStock from '../../classes/TimeStocktaking';
import jsonAnswer from '../../classes/jsonAnswer';

function updateTimespendRecordRoute(req, res) {
  if (
    !_.has(req, 'query') ||
    !_.has(req, 'body')
  ) return;

  const queryParamsPrep = req.query;
  const bodyParamsPrep = req.body;

  // Преобразование даты
  (queryParamsPrep.date)
    ? queryParamsPrep.date = parseDate(queryParamsPrep.date)
    : queryParamsPrep.date = parseDate(moment().format('DD.MM.YYYY'));

  timeStock.spend.edit(queryParamsPrep, bodyParamsPrep)
    .then((result) => {
      jsonAnswer.success(res, {
        message: 'Time spend record updated',
        data: result,
      });
    }, (error) => {
      jsonAnswer.warn(res, {
        code: 400,
        message: error,
      });
    });
}

export default updateTimespendRecordRoute;
