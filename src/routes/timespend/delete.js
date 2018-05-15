import parseDate from '../../config/dateParser';
import timeStock from '../../classes/TimeStocktaking';
import jsonAnswer from '../../classes/jsonAnswer';

function deleteTimespendRecordRoute(req, res) {
  if (!_.has(req, 'query')) return;

  const queryParamsPrep = req.query;

  // Преобразование даты
  queryParamsPrep.date = parseDate(queryParamsPrep.date);

  timeStock.spend.remove(queryParamsPrep)
    .then((result) => {
      jsonAnswer.success(res, {
        message: 'Time spend record was removed!',
        data: result,
      });
    }, (error) => {
      jsonAnswer.warn(res, {
        code: 400,
        message: error,
      });
    });
}

export default deleteTimespendRecordRoute;
