import parseDate from '../../config/dateParser';
import timeStock from '../../classes/TimeStocktaking';
import jsonAnswer from '../../classes/jsonAnswer';

function readTimespendRecordRoute(req, res) {
  if (!_.has(req, 'body')) return;

  const bodyPrep = req.body;

  // Преобразование даты
  bodyPrep.date = parseDate(bodyPrep.date);

  timeStock.spend.find(bodyPrep)
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