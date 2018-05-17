import moment from 'moment';
import parseDate from '../../config/dateParser';
import timeStock from '../../classes/TimeStocktaking';
import jsonAnswer from '../../classes/jsonAnswer';

function updateTimespendRecordRoute(req, res) {
  if (
    !_.has(req, 'query') ||
    !_.has(req, 'body')
  ) return;

  const queryPrep = req.body.query;
  const updatePrep = req.body.update;

  // Преобразование даты
  (queryPrep.date)
    ? queryPrep.date = parseDate(queryPrep.date)
    : queryPrep.date = parseDate(moment().format('DD.MM.YYYY'));

  // Преобразование даты
  (updatePrep.date)
    ? updatePrep.date = parseDate(updatePrep.date)
    : updatePrep.date = parseDate(moment().format('DD.MM.YYYY'));

  timeStock.spend.edit(queryPrep, updatePrep)
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
