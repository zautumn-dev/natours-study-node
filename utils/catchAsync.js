// 捕获异步错误 抛给错误处理中间件
const catchAsync = (fn) => (req, res, next) => fn(req, res).catch(next);
module.exports = catchAsync;
