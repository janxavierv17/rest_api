const express = require("express");
const router = express.Router();
const { asyncHandler } = require('../middleware/async-handler');
const User = require("../models").User
const bcrypt = require("bcrypt")
const { authenticateUser } = require("../middleware/auth-user")

/**
 * @desc    A route that will return the currently authenticated user 
 *          along with a 200 HTTP Status Code.
 * @route   GET /api/users
 * @access  PRIVATE / Authenticated User Only.
 */
router.get("/users", authenticateUser, asyncHandler(async (request, response) => {
    let user
    try {
        user = request.currentUser;
        const getUser = await User.findOne({
            where: {
                id: user.dataValues.id
            },
            attributes: {
                exclude: ["password", "createdAt", "updatedAt"]
            }
        })
        // This way of sending a response to the request is filtering out password.
        response.status(200).json({
            id: getUser.dataValues.id,
            firstName: getUser.dataValues.firstName,
            lastName: getUser.dataValues.lastName,
            emailAddress: getUser.dataValues.emailAddress,
        })
    } catch (error) {
        if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
            const errors = error.errors.map(error => error.message)
            response.status(400).json({ errors })
        } else {
            throw error;
        }
    }
}));

/**
 * @desc    A route that will create a new user and hash user password, 
 *          along with a 200 HTTP Status Code.
 * @route   GET /api/users
 * @access  PUBLIC
 */
router.post("/users", asyncHandler(async (request, response, next) => {
    try {
        const { firstName, lastName, emailAddress, password } = request.body
        await User.create({
            firstName: firstName,
            lastName: lastName,
            emailAddress: emailAddress,
            password: bcrypt.hashSync(password, 10)
        });
        response.status(201).location("/").end();
    } catch (error) {
        // This route checks and handles SequelizeValidationError or SequelizeUniqueConstraintError
        if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
            const errors = error.errors.map(error => error.message)
            response.status(400).json({ errors })
        } else {
            response.status(400).json()
        }
    }
}))

module.exports = router;