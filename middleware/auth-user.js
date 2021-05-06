'use strict';

const auth = require("basic-auth");
const bcrypt = require("bcrypt");
const { User } = require("../models");

exports.authenticateUser = async (request, response, next) => {
    let message;
    const credentials = auth(request)
    console.log(credentials)

    if (credentials) {
        const user = await User.findOne({ where: { emailAddress: credentials.name } })

        if (user) {
            const authenticated = bcrypt.compareSync(credentials.pass, user.password);
            request.currentUser = user;

            if (authenticated) {
                console.log(`Authentication successful for user: ${credentials.name}`)
                request.currentUser = user;
            } else {
                message = `Authentication failed for user: ${credentials.name}`
            }

        } else {
            message = `User not found for: ${credentials.name}`
        }
    } else {
        // A vague message for security.
        // If we provide a "Username not found" or "Incorrect passwor"
        // would inadvertently help anyone attempting to hack a user account.
        message = 'Auth header not found.';
    }
    if (message) {
        console.warn(message)
        response.status(401).json({ message: "Access Denied." })
    } else {
        next();
    }
}