class JSON_Answer {
  success(res, data) {
    let prepData = _.compactObject(data);
    prepData = _.pick(prepData, [
      'data',
      'message',
      'details',
      'code',
    ]);

    prepData = _.defaults(prepData, {
      code: 200,
      message: 'Request successfull',
    });

    res.statusCode = prepData.code;
    res.json(prepData);
  }

  warn(res, data) {
    if (typeof data === 'string') {
      res.json({
        message: data,
        code: 400,
      });

      return;
    }

    let prepData = _.compactObject(data);
    prepData = _.pick(prepData, [
      'data',
      'message',
      'details',
      'code',
    ]);

    prepData = _.defaults(prepData, {
      code: 400,
      message: 'Check your request for errors',
    });

    res.statusCode = prepData.code;
    res.json(prepData);
  }

  fatal(res, data) {
    let prepData = _.compactObject(data);
    prepData = _.pick(prepData, [
      'data',
      'message',
      'details',
      'code',
    ]);

    prepData = _.defaults(prepData, {
      code: 500,
      message: 'Server error appeared. Check details in `data` for debug...',
    });

    res.statusCode = prepData.code;
    res.json(prepData);
  }
}

const jsonAnswer = new JSON_Answer();

export default {
  success: jsonAnswer.success,
  warn: jsonAnswer.warn,
  fatal: jsonAnswer.fatal,
};
