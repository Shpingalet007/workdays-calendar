import parseDate from '../../config/dateParser';
import timeStock from '../../classes/TimeStocktaking';
import jsonAnswer from '../../classes/jsonAnswer';

function readTimespendRecordRoute(req, res) {
  if (!_.has(req, 'query')) return;

  const queryParamsPrep = req.query;

  // Преобразование даты
  queryParamsPrep.date = parseDate(queryParamsPrep.date);

  timeStock.spend.find(queryParamsPrep)
    .then((result) => {
      jsonAnswer.success(res, {
        message: 'Time spend record found!',
        data: result,
      });
    }, (error) => {
      jsonAnswer.warn(res, {
        code: 400,
        message: error,
      });
    });
}

export default readTimespendRecordRoute;
