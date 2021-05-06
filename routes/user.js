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
router.get("/", authenticateUser, asyncHandler(async (request, response) => {
    const user = request.currentUser;

    response.status(200);
    response.json({
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
router.post("/", asyncHandler(async (request, response, next) => {
    try {
        const user = await User.create(request.body);
        console.log("POST USER: ", user)
    } catch (error) {
        response.error = error;
        next();
    }
}))

module.exports = router;