const path = require("path");
const propertyValidator = require("../errors/propertyValidators");
const nextId = require("../utils/nextId");
const dishes = require(path.resolve("src/data/dishes-data"));

const fileName = "Dish";

// return list of dishes, used for Get method
const list = (req, res, next) => {
  res.json({ data: dishes });
};

// used to check whether the dish exist for a given dishId or not
const dishExists = (req, res, next) => {
  const { dishId } = req.params;
  let filterDish = (d) => d.id === dishId;
  const foundDish = dishes.find(filterDish);
  if (foundDish) {
    res.locals.dish = foundDish;
    return next();
  }

  return next({
    status: 404,
    message: `Dish does not exist: ${dishId}`,
  });
};

// used to get single dish detail
const read = (req, res, next) => {
  const dish = res.locals.dish;
  res.json({ data: dish });
};

// this create new dish in database
const create = (req, res, next) => {
  const { data: { name, description, price, image_url } = {} } = req.body;
  let newDish = {
    id: nextId(),
    name,
    description,
    price,
    image_url,
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
};

// this update the exisitng dish
const update = (req, res, next) => {
  const { data: { id, name, description, price, image_url } = {} } = req.body;
  const dish = res.locals.dish;

  if (id && id != dish.id) {
    return next({
        status: 400,
        message: `Dish id does not match route id. Dish: ${id}, Route: ${dish.id}`
    })
  }

  dish.name = name;
  dish.description = description;
  dish.price = price;
  dish.image_url = image_url;

  res.json({ data: dish });
};

module.exports = {
  list,
  read: [dishExists, read],
  create: [
    propertyValidator.missingPropertyAndStringValue(fileName, "name"),
    propertyValidator.missingPropertyAndStringValue(fileName, "description"),
    propertyValidator.missingPropertyAndStringValue(fileName, "image_url"),
    propertyValidator.missingPropertyAndValidNumber(fileName, "price"),
    create,
  ],
  update: [
    dishExists,
    propertyValidator.missingPropertyAndStringValue(fileName, "name"),
    propertyValidator.missingPropertyAndStringValue(fileName, "description"),
    propertyValidator.missingPropertyAndStringValue(fileName, "image_url"),
    propertyValidator.missingPropertyAndValidNumber(fileName, "price"),
    update,
  ],
};
