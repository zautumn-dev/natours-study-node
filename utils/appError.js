class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    // 4 开头的错误是客户端错误
    // this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.status = `${statusCode}`;

    // 修改状态码
    this.statusCode = statusCode || 500;

    // 当报错的error 内部没有这个属性时，表示是内置的Error
    this.isCustomize = true;

    // error.stack 会显示错误堆栈信息
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
