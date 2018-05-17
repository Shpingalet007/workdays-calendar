import moment from 'moment';
import parseDate from '../../config/dateParser';
import timeStock from '../../classes/TimeStocktaking';
import jsonAnswer from '../../classes/jsonAnswer';

function readTimespendRecordsRoute(req, res) {
  if (!_.has(req, 'body')) return;
  if (!_.has(req.body, 'emails')) return;
  if (!_.has(req.body, 'dates')) return;

  const bodyPrep = req.body;

  bodyPrep.dates = bodyPrep.dates
    .map(date => parseDate(date));

  timeStock.spend.list({
    emails: bodyPrep.emails,
    dates: bodyPrep.dates,
    datesAreRange: bodyPrep.datesAreRange,
  }).then((result) => {
    jsonAnswer.success(res, {
      message: 'Time spends found!',
      data: result,
    });
  }, (error) => {
    jsonAnswer.warn(res, {
      message: error,
    });
  });
}

export default readTimespendRecordsRoute;
