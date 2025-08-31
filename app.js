const express = require('express')
const morgan = require('morgan')

const {setTours} = require('./controller/tours')
const toursRouter = require('./routes/tours')
const usersRouter = require("./routes/users");

const app = express()

// TODO 中间件
// morgan 日志中间件  json 读取请求体body中的值
app.use(morgan('dev')).use(express.json()).use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {

    console.log('hello from the middleware 👋')

    next()
})

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})

app.use('/api/v1/tours', toursRouter)
app.use('/api/v1/users', usersRouter)

module.exports = app
