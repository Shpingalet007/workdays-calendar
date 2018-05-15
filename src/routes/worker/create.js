import timeStock from '../../classes/TimeStocktaking';
import jsonAnswer from '../../classes/jsonAnswer';

function createWorkerRoute(req, res) {
  if (!_.has(req, 'body')) return;

  timeStock.worker
    .create(req.body)
    .then((result) => {
      jsonAnswer.success(res, {
        message: 'Successfully created new worker!',
      });
    }, (error) => {
      jsonAnswer.warn(res, {
        message: 'Database error occured!',
        details: error.message,
      });
    });
}

export default createWorkerRoute;
