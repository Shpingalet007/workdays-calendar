import timeStock from '../../classes/TimeStocktaking';
import jsonAnswer from '../../classes/jsonAnswer';

function updateWorkerRoute(req, res) {
  if (!_.has(req, 'body')) return;

  timeStock.worker
    .edit(req.body.query, req.body.update)
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

export default updateWorkerRoute;
