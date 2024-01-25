const validateOrderStatus = () => {
  return (req, res, next) => {
    let status = "status";
    let validStatus = ["pending", "preparing", "out-for-delivery", "delivered"];

    const { data = {} } = req.body;
    if (!data[status] || validStatus.indexOf(data[status])) {
      return next({
        status: 400,
        message: `Order must have a status of ${validStatus.join(",")}`,
      });
    }

    if (data[status] == 'delivered') {
        return next({
            status: 400,
            message: `A delivered order cannot be changed`,
          });
    }

    return next();
  };
};

module.exports = validateOrderStatus;
