const Router = require('express').Router();
const controller = require('../controllers/restaurant.controller');

Router.route('/restaurent')
  .get(controller.read)
  .post(controller.create)
  .patch(controller.update)
  .delete(controller.remove);
Router.route('/restaurent/search').post(controller.search);

module.exports = Router;
