const express = require('express');
const handler = require('../controller/tours');

const toursRouter = express.Router();

// 根据id 处理数据类似 中间件
// toursRouter.param('id', handler.checkTourId);

toursRouter.route('/cheap-top-5').get(handler.aliasTopTour, handler.getAllTours);
toursRouter.route('/state').get(handler.getTourState);
toursRouter.route('/monthly-plan').get(handler.getMonthlyPlan);

toursRouter.route('/').get(handler.getAllTours).post(handler.checkCreateTour, handler.createTour);
toursRouter.route('/:id').get(handler.getTour).patch(handler.updateTour).delete(handler.delTour);

module.exports = toursRouter;
