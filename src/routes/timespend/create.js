import moment from 'moment';
import parseDate from '../../config/dateParser';
import timeStock from '../../classes/TimeStocktaking';
import jsonAnswer from '../../classes/jsonAnswer';

function createTimespendRecordRoute(req, res) {
  if (!_.has(req, 'body')) return;

  const bodyParamsPrep = req.body;

  // Преобразование даты
  (bodyParamsPrep.date)
    ? bodyParamsPrep.date = parseDate(bodyParamsPrep.date)
    : bodyParamsPrep.date = parseDate(moment().format('DD.MM.YYYY'));

  console.log(bodyParamsPrep.date);

  timeStock.spend.create(bodyParamsPrep)
    .then((result) => {
      jsonAnswer.success(res, {
        message: result,
      });
    }, (error) => {
      jsonAnswer.warn(res, error);
    });
}

export default createTimespendRecordRoute;
