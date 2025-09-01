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

const getAllTours = (req, res) => {
  res.json({
    status: 200,
    requestTime: req.requestTime,
    data: {
      // len: tourSimples.length,
      // list: tourSimples,
    },
  });
};
const getTour = (req, res) => {
  try {
    const id = req.params.id * 1;

    // const tour = tourSimples.find((tour) => id === tour.id);

    res.json({
      status: 200,
      message: 'success',
      // data: tour,
    });
  } catch (e) {}
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
    const id = req.params.id * 1;

    // const tourIndex = tourSimples.findIndex((tour) => id === tour.id);
    //
    // const tour = Reflect.get(tourSimples, tourIndex);
    //
    // Reflect.set(tourSimples, tourIndex, Object.assign(tour, req.body));

    // 写入文件
    // await fsPromises.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tourSimples), {
    //   encoding: 'utf8',
    // });
    //
    // res.json({
    //   status: 200,
    //   message: 'success',
    //   data: tour,
    // });
  } catch (e) {}
};
const delTour = async (req, res) => {
  try {
    const id = req.params.id * 1;

    // const tourIndex = tourSimples.findIndex((tour) => id === tour.id);
    //
    // const tour = Reflect.get(tourSimples, tourIndex);
    //
    // tourSimples.splice(tourIndex, 1);
    //
    // // 写入文件
    // await fsPromises.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tourSimples), {
    //   encoding: 'utf8',
    // });
    //
    // res.status(204).json({
    //   status: 204,
    //   message: 'success',
    //   data: tour,
    // });
  } catch (e) {}
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  delTour,
  checkCreateTour,
};
