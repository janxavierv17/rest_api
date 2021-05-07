const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../middleware/async-handler")
const { Op } = require('sequelize');
const Course = require("../models").Course;
const User = require("../models").User
const { authenticateUser } = require("../middleware/auth-user")

/**
 * @desc    Returns a list of courses including the user that owns each course.
 * @route   GET /api/course
 * @access  PUBLIC
 */
router.get("/courses", asyncHandler(async (request, response) => {
    const courses = await Course.findAll()
    response.status(200).json({ courses })
}))

/**
 * @desc    Returns a course including the user that owns each course.
 * @route   GET /api/courses/:id
 * @access  PUBLIC
 */
router.get("/courses/:id", asyncHandler(async (request, response) => {
    // Excludes createdAt & updatedAt
    const course = await Course.findOne({
        where: { id: request.params.id },
        attributes: {
            exclude: ["createdAt", "updatedAt"]
        }
    })
    console.log("The course that matches the params ID: ", course)
    response.status(201).json({ message: `A course is not yet created but here's the ID ${request.params.id}` })
}))

/**
 * @desc    Creates a course
 * @route   POST /api/courses/
 * @access  PRIVATE
 */
router.post("/courses", authenticateUser, asyncHandler(async (request, response) => {
    const authenticatedUser = request.currentUser;
    const { title, description } = request.body
    if (authenticatedUser) {
        console.log("You're allowed to create a course.")
        const createdCourse = await Course.create({
            title: title,
            description: description,
            userId: authenticatedUser.dataValues.id
        })
        console.log("CreatedCourseID: ", createdCourse)
        response.status(201).location(`/api/course/${createdCourse.dataValues.id}`).end();
    }
}))


/**
 * @desc    Allow update only if the user is the creator of the course.
 * @route   PUT /api/courses/:id
 * @access  PRIVATE
 */
router.put("/courses/:id", authenticateUser, asyncHandler(async (request, response) => {
    const creator = request.currentUser
    // Find the course to update using the primary key method.
    const course = await Course.findByPk(request.params.id)

    if (creator.dataValues.id === course.dataValues.userId) {
        console.info("THE CREATOR OF THIS COURSE!")
        course.update(request.body)
        response.status(204).end();
    } else {
        console.log("You're not the creator of this course.")
        response.status(403).end();
    }
}))

/**
 * @desc    Allow delete only if the user is the creator of hte course.
 * @route   DELETE /api/courses/:id
 * @access  PRIVATE
 */
router.delete("/courses/:id", authenticateUser, asyncHandler(async (request, response) => {
    const creator = request.currentUser
    // Find the course to update using the primary key method.
    const course = await Course.findByPk(request.params.id)

    if (course.dataValues.userId === creator.dataValues.id) {
        console.info("You're the creator of this course.")
        course.destroy();
        response.status(204).end();
    } else {
        console.log("You're not the creator of this course.")
        response.status(403).end();
    }
}))

module.exports = router