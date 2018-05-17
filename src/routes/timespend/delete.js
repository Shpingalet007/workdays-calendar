import parseDate from '../../config/dateParser';
import timeStock from '../../classes/TimeStocktaking';
import jsonAnswer from '../../classes/jsonAnswer';

function deleteTimespendRecordRoute(req, res) {
  if (!_.has(req, 'body')) return;

  const bodyPrep = req.body;

  // Преобразование даты
  bodyPrep.date = parseDate(bodyPrep.date);

  timeStock.spend.remove(bodyPrep)
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
