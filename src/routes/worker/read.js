import timeStock from '../../classes/TimeStocktaking';
import jsonAnswer from '../../classes/jsonAnswer';

function readWorkerRoute(req, res) {
  if (!_.has(req, 'query')) return;

  timeStock.worker
    .find(req.query)
    .then((result) => {
      jsonAnswer.success(res, {
        message: 'Worker found!',
        data: result,
      });
    }, (error) => {
      jsonAnswer.warn(res, {
        message: error,
      });
    });
}

export default readWorkerRoute;
