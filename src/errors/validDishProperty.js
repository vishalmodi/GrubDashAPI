const validDishProperty = (propertyName = "dishes") => {
  return (req, res, next) => {
    const { data = {} } = req.body;
    if (!data[propertyName]) {
      return next({
        status: 400,
        message: `Order must include a dish`,
      });
    }

    if (!Array.isArray(data[propertyName]) || data[propertyName].length == 0) {
      return next({
        status: 400,
        message: `Order must include at least one dish`,
      });
    }

    let dishes = data[propertyName];

    for (let index = 0; index < dishes.length; index++) {
      let dish = dishes[index];
      if (
        !dish["quantity"] ||
        dish["quantity"] <= 0 ||
        !Number.isInteger(dish["quantity"])
      ) {
        return next({
          status: 400,
          message: `Dish ${index} must have a quantity that is an integer greater than 0`,
        });
      }
    }

    return next();
  };
};

module.exports = validDishProperty;
