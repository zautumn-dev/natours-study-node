const AppError = require('../utils/appError');

function handleCastErrorDB(err) {
  return new AppError(`Invalid ${err.path}: ${err.value}.`, 400);
}

function handleDuplicateFieldsDB(err) {
  const value = Reflect.get(err.errmsg.match(/(["'])(\\?.)*?\1/), 0);
  console.log(value);
  return new AppError(`Duplicate field value: ${value}. Please use another value!`, 400);
}

function handleValidationErrorDB(err) {
  const values = Object.values(err.errors).map((e) => e.message);
  return new AppError(`invalid input data. ${values.join(', ')}`, 400);
}

function handleJsonWebTokenError(err) {
  return new AppError(`Invalid token. Please log in again!`, 401);
}

function handleJsonWebTokenExpiredError(err) {
  return new AppError(`Token expired. Please log in again!`, 401);
}

function sendErrorDev(err, req, res, next) {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}

function sendErrorProd(err, req, res, next) {
  // 自定义错误 操作错误
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    return;
  }

  //  未知错误
  // 日志处理
  console.error(err);

  res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
  });
}

const errorHandler = (err, req, res, next) => {
  err.statusCode ||= 500; // 逻辑或赋值（x ||= y）运算仅在 x 为假值时为其赋值
  err.status ||= '500'; // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Logical_OR_assignment

  switch (process.env.NODE_ENV) {
    case 'development':
      sendErrorDev(err, req, res, next);
      break;
    case 'production':
      let operationalError = null;
      if (err.name === 'CastError') operationalError = handleCastErrorDB(err);
      if (err.code === 11000) operationalError = handleDuplicateFieldsDB(err);
      if (err.name === 'ValidationError') operationalError = handleValidationErrorDB(err);

      if (err.name === 'JsonWebTokenError') operationalError = handleJsonWebTokenError(err);
      if (err.name === 'TokenExpiredError') operationalError = handleJsonWebTokenExpiredError(err);
      sendErrorProd(operationalError ?? err, req, res, next);
      break;
  }
};

module.exports = errorHandler;
