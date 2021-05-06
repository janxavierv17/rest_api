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
    console.log(user)
    response.status(200);
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
        response.error = error;
        next();
    }
}))

module.exports = router;