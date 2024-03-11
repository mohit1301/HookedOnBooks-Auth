const JwtStrategy = require('passport-jwt').Strategy;
const User = require('./models/userModel');
const passport = require('passport');
require('dotenv').config();

const cookieExtractor = function (req) {
    let accessToken = null;
    // Check if the token is present in the authorization header
    if (req.headers && req.headers.authorization) {
        const parts = req.headers.authorization.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
            accessToken = parts[1];
        }
    }
    // If token is not found in the authorization header, check the cookies
    if (!accessToken && req.cookies && req.cookies.accessToken) {
        accessToken = req.cookies.accessToken;
    }
    console.log('passport access token = ', accessToken)
    return accessToken;
};

const opts = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET_KEY,
    ignoreExpiration: true,
    passReqToCallback: true
};

// Use the JwtStrategy in passport
passport.use(new JwtStrategy(opts, function (req, jwt_payload, done) {
    const refreshToken = req.cookies.refreshToken;

    // Check if the token has expired
    if (Date.now() >= jwt_payload.exp * 1000) {
        console.log('Token has expired');
        // Pass the refresh token & error message to the next middleware
        req.refreshToken = refreshToken;
        req.errorMessage = 'TokenExpired';
        return done(null, true);
    }

    User.findOne({ _id: jwt_payload.userId }, function (err, user) {
        if (err) {
            console.log('Error finding user:', err);
            return done(err, false);
        }
        if (user) {
            console.log('User found');
            user.isAuthenticated = true;
            return done(null, user);
        } else {
            console.log('User not found');
            return done(null, false);
        }
    });
}))

module.exports = passport