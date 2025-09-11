const errorHandler = (err, req, res, next) => {
  err.statusCode ||= 500; // 逻辑或赋值（x ||= y）运算仅在 x 为假值时为其赋值
  err.status ||= '500'; // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Logical_OR_assignment

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = errorHandler;
