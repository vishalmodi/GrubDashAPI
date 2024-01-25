const path = require("path");
const orders = require(path.resolve("src/data/orders-data"));
const propertyValidator = require("../errors/propertyValidators");
const validDishProperty = require("../errors/validDishProperty");
const validateOrderStatus = require("../errors/validateOrderStatus");
const canOrderDelete = require("../errors/canOrderDelete");

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");
const fileName = "Order";

// return list of orders, used for Get method
const list = (req, res, next) => {
  res.json({ data: orders });
};

// used to check whether the order exist for a given orderId or not
const orderExists = (req, res, next) => {
  const { orderId } = req.params;
  let filterCond = (d) => d.id === orderId;
  const foundOrder = orders.find(filterCond);
  if (foundOrder) {
    res.locals.order = foundOrder;
    return next();
  }

  return next({
    status: 404,
    message: `Order does not exist: ${orderId}`,
  });
};

// used to get single order detail
const read = (req, res, next) => {
  const order = res.locals.order;
  res.json({ data: order });
};

// this method create new order
const create = (req, res, next) => {
  const { data: { deliverTo, mobileNumber } = {} } = req.body;
  let newOrder = {
    id: nextId(),
    deliverTo,
    mobileNumber,
    status: "pending",
    dishes: req.body.data.dishes,
  };
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
};

// this method update existing order
const update = (req, res, next) => {
  const { data: { id, deliverTo, mobileNumber, status } = {} } = req.body;
  const order = res.locals.order;

  if (id && id != order.id) {
    return next({
      status: 400,
      message: `Order id does not match route id. Order: ${id}, Route: ${order.id}.`,
    });
  }

  order.deliverTo = deliverTo;
  order.mobileNumber = mobileNumber;
  order.status = status;

  let orderDishes = req.body.data.dishes;

  for (let index = 0; index < orderDishes.length; index++) {
    let originalIndex = order.dishes.findIndex(
      (d) => d.id == orderDishes[index].id
    );

    if (originalIndex) {
      order.dishes[originalIndex] = orderDishes[index];
    }
  }

  res.json({ data: order });
};

// this delete the existing order
const destroy = (req, res, next) => {
  const order = res.locals.order;
  const foundIndex = orders.findIndex((o) => o.id == order.id);
  let deletedOrder = orders.splice(foundIndex, 1);
  res.sendStatus(204);
};

module.exports = {
  list,
  read: [orderExists, read],
  create: [
    propertyValidator.missingPropertyAndStringValue(fileName, "deliverTo"),
    propertyValidator.missingPropertyAndStringValue(fileName, "mobileNumber"),
    validDishProperty(),
    create,
  ],
  update: [
    orderExists,
    // validate property must be prevent and have value
    propertyValidator.missingPropertyAndStringValue(fileName, "deliverTo"),
    propertyValidator.missingPropertyAndStringValue(fileName, "mobileNumber"),
    // validate dishes included in the order
    validDishProperty(),
    // validate orde status
    validateOrderStatus(),
    // finally update the order
    update,
  ],
  delete: [orderExists, canOrderDelete(), destroy],
};
