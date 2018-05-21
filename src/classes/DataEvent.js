class DataEvent {
  constructor({
    message,
    code,
    data,
  }) {
    if (message) this.message = message;
    else this.message = 'Check your request for errors!';

    if (code) this.code = code;
    else this.code = 400;

    if (data) this.data = data;
  }

  static DBSuccess(object, dataName) {
    return new DataEvent({
      data: object,
      message: `${dataName} successfully found!`,
      code: 200,
    });
  }

  static DBSuccessCreate(object, dataName) {
    return new DataEvent({
      data: object,
      message: `${dataName} successfully created!`,
      code: 201,
    });
  }

  static DBSuccessUpdate(object, dataName) {
    return new DataEvent({
      data: object,
      message: `${dataName} successfully updated!`,
      code: 201,
    });
  }

  static DBSuccessRemove(object, dataName) {
    return new DataEvent({
      data: object,
      message: `${dataName} successfully removed!`,
      code: 201,
    });
  }

  static DBNotCreated(dataName) {
    return new DataEvent({
      message: `Failed to create ${dataName}!`,
      code: 201,
    });
  }

  static DBNotFound(dataName) {
    return new DataEvent({
      message: `${dataName} not found!`,
      code: 404,
    });
  }

  static InputNotFound(dataName) {
    return new DataEvent({
      message: `${dataName} is required!`,
      code: 404,
    });
  }

  static DBAssocNotFound(dataName) {
    return new DataEvent({
      message: `Provided ${dataName} not found!`,
      code: 406,
    });
  }

  static DBAssocSomeNotFound(dataName) {
    return new DataEvent({
      message: `Some of provided ${dataName} not found!`,
      code: 406,
    });
  }

  static DBNotUniqueRec(dataName) {
    return new DataEvent({
      message: `${dataName} record is exist!`,
      code: 208,
    });
  }
}

export default DataEvent;
