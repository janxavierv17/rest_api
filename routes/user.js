const express = require("express");
const router = express.Router();
const { asyncHandler } = require('../middleware/async-handler');
const User = require("../models").User
const { authenticateUser } = require("../middleware/auth-user")

/**
 * @desc    A route that will return the currently authenticated user 
 *          along with a 200 HTTP Status Code.
 * @route   GET /api/users
 * @access  PUBLIC
 */
router.get("/users", authenticateUser, asyncHandler(async (request, response) => {
    const user = request.currentUser;
    response.status(200);
    // This way of sending a response to the request is filtering out password.
    response.json({
        id: user.dataValues.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress
    })
}));

/**
 * @desc    A route that will create a new user, 
 *          along with a 200 HTTP Status Code.
 * @route   GET /api/users
 * @access  PUBLIC
 */
router.post("/users", asyncHandler(async (request, response, next) => {
    try {
        console.log(request.body)
        await User.create(request.body);
        response.status(201).location("/").end();
    } catch (error) {
        // This route checks and handles SequelizeValidationError or SequelizeUniqueConstraintError
        console.log("ERROR: ", error.name)
        if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
            const errors = error.errors.map(error => error.message)
            response.status(400).json({ errors })
        } else {
            throw error;
        }
    }
}))

module.exports = router;