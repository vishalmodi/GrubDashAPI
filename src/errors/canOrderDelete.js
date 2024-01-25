const canOrderDelete = () => {
  return (req, res, next) => {
    let order = res.locals.order;

    if (order.status !== "pending") {
      return next({
        status: 400,
        message: `An order cannot be deleted unless it is pending`,
      });
    }

    return next();
  };
};

module.exports = canOrderDelete;
