const fsPromises = require('node:fs/promises');
const Tour = require('../models/tour');

// const tourSimples = []

// function setTours(tours) {
//     tours.forEach(tour => {
//         tourSimples.push(tour)
//     })
// }

// const checkTourId = (req, res, next, val) => {
//   try {
//     console.log(`Tour id is ${val}`);
//
//     const id = val * 1;
//
//     // const tour = tourSimples.find((tour) => id === tour.id);
//     //
//     // if (!tour) throw new Error(`Not find tour id for ${id}`);
//
//     next();
//   } catch (err) {
//     return res.status(404).json({
//       status: 404,
//       message: err.message,
//     });
//   } finally {
//   }
// };

const checkCreateTour = (req, res, next) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({
      status: 400,

      message: 'Please enter a valid name and price!',
    });
  }
  next();
};

const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();

    res.json({
      status: 200,
      requestTime: req.requestTime,
      data: {
        len: tours.length,
        list: tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 404,
      message: err.message,
    });
  }
};
const getTour = async (req, res) => {
  try {
    const { id } = req.params;

    // const tour = await Tour.findById(id);

    // findOne
    const tour = await Tour.find({ _id: id });

    res.json({
      status: 200,
      message: 'success',
      data: tour,
    });
  } catch (e) {
    res.status(404).json({
      status: 404,
      message: e.message,
    });
  }
};
const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 201,
      message: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
};
const updateTour = async (req, res) => {
  try {
    const { id } = req.params;

    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      status: 200,
      message: 'success',
      data: tour,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
};
const delTour = async (req, res) => {
  try {
    const { id } = req.params;

    const tour = await Tour.findByIdAndDelete(id);

    if (!tour)
      return res.status(404).json({
        status: 404,
        message: 'No tour found',
      });

    res.status(204).json({
      status: 204,
      message: 'success',
      data: null,
    });
  } catch (e) {
    res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  delTour,
  checkCreateTour,
};
