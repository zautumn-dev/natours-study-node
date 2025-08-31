const express = require("express");
const handler = require("../controller/tours");

const toursRouter = express.Router()


toursRouter.param('id', handler.checkTourId)

toursRouter.route('/').get(handler.getAllTours).post(handler.checkCreateTour, handler.createTour)
toursRouter.route('/:id').get(handler.getTour).patch(handler.updateTour).delete(handler.delTour)

module.exports = toursRouter