const missingPropertyAndStringValue = (fileName, propertyName) => {
  return (req, res, next) => {
    const { data = {} } = req.body;
    if (data[propertyName] && data[propertyName].trim() !== "") {
      return next();
    } else {
      next({
        status: 400,
        message: `${fileName} must include a ${propertyName}`,
      });
    }
  };
};

const missingPropertyAndValidNumber = (fileName, propertyName) => {
  return (req, res, next) => {
    const { data = {} } = req.body;

    if (!data[propertyName]) {
      return next({
        status: 400,
        message: `${fileName} must include a ${propertyName}`,
      });
    }

    if (data[propertyName] <= 0 || !Number.isInteger(data[propertyName])) {
      return next({
        status: 400,
        message: `${fileName} must have a ${propertyName} that is an integer greater than 0`,
      });
    }

    return next();
    // if (
    //   data[propertyName] &&
    //   (data[propertyName] > 0 || Number.isInteger(data[propertyName]))
    // ) {
    //   return next();
    // }

    // let message = "";
    // if (!data[propertyName]) {
    //   message = `${fileName} must include a ${propertyName}`;
    // } else {
    //   message = `${fileName} must have a ${propertyName} that is an integer greater than 0`;
    // }
    // next({
    //   status: 400,
    //   message: message,
    // });
  };
};

module.exports = {
  missingPropertyAndStringValue: missingPropertyAndStringValue,
  missingPropertyAndValidNumber: missingPropertyAndValidNumber,
};
