const express = require("express");
const {
    getAllUsers,
    getUser,
    updateUser,
    delUser,
    createUser
} = require("../controller/users");

const usersRouter = express.Router()

usersRouter.route('/').get(getAllUsers).post(createUser)
usersRouter.route('/:id').get(getUser).patch(updateUser).delete(delUser)

module.exports = usersRouter