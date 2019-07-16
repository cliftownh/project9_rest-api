// authentication middleware
const auth = require('basic-auth');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

module.exports = (req, res, next) => {
    let message = null;

    // Parse the user's credentials from the Authorization header.
    const credentials = auth(req);

    // If the user's credentials are available...
    if (credentials) {
        // Attempt to retrieve the user from the data store
        // by their username (i.e. the user's "key"
        // from the Authorization header).
        User.findOne({ 
            where: {emailAddress: credentials.name} })
            .then(user => {
                if (user) {
                    // Use the bcryptjs npm package to compare the user's password
                    // (from the Authorization header) to the user's password
                    // that was retrieved from the data store.
                    const authenticated = bcrypt
                        .compareSync(credentials.pass, user.password);

                    // If the passwords match...
                    if (authenticated) {
                        console.log(`Authentication successful for user: ${user.firstName} ${user.lastName}`);
                        // Then store the retrieved user object on the request object
                        // so any middleware functions that follow this middleware function
                        // will have access to the user's information.
                        req.currentUser = user;
                        next();
                    } else {
                        message = `Incorrect password for: ${user.firstName} ${user.lastName}`;
                        const error = new Error(message);
                        error.status = 401;
                        next(error);
                    }
                } else {
                    message = `User not found for email: ${credentials.name}`;
                    const error = new Error(message);
                    error.status = 401;
                    next(error);
                }
            })
            .catch((error) => {
                next(error);
            });
        // If a user was successfully retrieved from the data store...
    } else {
        message = 'User must sign in.';
        const error = new Error(message);
        error.status = 401;
        next(error);
    }

    // If user authentication failed...
    if (message) {
        console.warn(message);
    
        // Return a response with a 401 Unauthorized HTTP status code.
        const error = new Error('Acces Denied')
        error.status = 401;
        next(error);
        // res.status(401).json({ message: 'Access Denied' });
    }
  };

