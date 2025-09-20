const catchAsync = require('./catchAsync');
const AppError = require('./appError');
const Tour = require('../models/tour');

exports.delOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const doc = await Model.findByIdAndDelete(id);

    if (!doc) return next(new AppError(`no document found with that ${id}`, 404));

    res.status(204).json({
      status: 204,
      message: 'success',
      data: null,
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create({
      ...req.body,
    });
    res.status(201).json({
      status: 201,
      message: 'success',
      data: {
        id: doc._id,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    let model = Model.findById(id);

    if (popOptions) model = model.populate(popOptions);

    model = await model;

    if (!model) return next(new AppError(`no tour found with that ${id}`, 404));

    res.json({
      status: 200,
      message: 'success',
      data: model,
    });
  });
