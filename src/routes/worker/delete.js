import timeStock from '../../classes/TimeStocktaking';
import jsonAnswer from '../../classes/jsonAnswer';

function deleteWorkerRoute(req, res) {
  if (!_.has(req, 'body')) return;

  timeStock.worker
    .remove(req.body)
    .then((result) => {
      jsonAnswer.success(res, {
        message: 'Worker removed!',
        data: result,
      });
    }, (error) => {
      jsonAnswer.warn(res, {
        code: 404,
        message: error,
      });
    });
}

export default deleteWorkerRoute;