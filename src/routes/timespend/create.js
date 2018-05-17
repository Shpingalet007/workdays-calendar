import moment from 'moment';
import parseDate from '../../config/dateParser';
import timeStock from '../../classes/TimeStocktaking';
import jsonAnswer from '../../classes/jsonAnswer';

function createTimespendRecordRoute(req, res) {
  if (!_.has(req, 'body')) return;

  const bodyPrep = req.body;

  // Преобразование даты
  bodyPrep.date = (bodyPrep.date)
    ? parseDate(bodyPrep.date)
    : parseDate(moment().format('DD.MM.YYYY'));

  console.log(bodyPrep.date);

  timeStock.spend.create(bodyPrep)
    .then((result) => {
      jsonAnswer.success(res, {
        message: result,
      });
    }, (error) => {
      jsonAnswer.warn(res, error);
    });
}

export default createTimespendRecordRoute;
