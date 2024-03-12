const express = require('express')
const User = require('../models/userModel')
const router = express.Router()
const { hashSync, compareSync } = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

router.get('/', (req, res) => {
    res.render('dashboard', {authBaseUrl: process.env.AUTH_BASEURL})
})

router.get('/register', (req, res) => {
    res.render('register', {authBaseUrl: process.env.AUTH_BASEURL})
})

// register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
        res.render('register', {
            errorMessage: 'All fields (username, email, password) are required',
            authBaseUrl: process.env.AUTH_BASEURL
        })
    }
    const user = new User({
        username,
        email,
        password: hashSync(password, 10)
    })

    try {
        await user.save()
        res.render('login', {
            errorMessage: 'User Registered Successfully',
            authBaseUrl: process.env.AUTH_BASEURL
        })
    } catch {
        res.redirect('/auth', {
            errorMessage: 'An error occurred'
        })
    }
})

router.get('/login', (req, res) => {
    if (req.cookies.accessToken) {
        return res.redirect(`${process.env.BOOKS_BASEURL}/books/recentlyAdded`);
    }
    res.render('login', {authBaseUrl: process.env.AUTH_BASEURL})
})

// login
router.post('/login', async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.render('register', {
            errorMessage: 'All fields (email, password) are required',
            authBaseUrl: process.env.AUTH_BASEURL
        })
    }

    const user = await User.findOne({ email: email })
    if (!user) {
        return res.render('login', {
            errorMessage: 'User does not exist',
            authBaseUrl: process.env.AUTH_BASEURL
        })
    }

    if (!compareSync(password, user.password)) {
        return res.render('login', {
            errorMessage: 'Invalid credentials',
            authBaseUrl: process.env.AUTH_BASEURL
        })
    }

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    // save the refresh token with user details
    user.refreshToken = refreshToken
    await user.save()

    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, domain: `${process.env.BOOKS_DOMAIN}`})
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, domain: `${process.env.AUTHOR_DOMAIN}`})
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, domain: `${process.env.BOOKS_DOMAIN}`})
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, domain: `${process.env.AUTHOR_DOMAIN}`})
    
    setTimeout(()=>{
        res.redirect(302, `${process.env.BOOKS_BASEURL}/books/recentlyAdded`)
    }, 3000)
})

router.get('/newAccessToken', async (req, res) => {

    let refreshToken = null
    if (req.headers && req.headers.authorization) {
        const parts = req.headers.authorization.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
            refreshToken = parts[1];
        }
    }

    if (!refreshToken || refreshToken == null) {
        res.redirect('/auth/login')
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);
        const userId = decoded.userId;

        const user = await User.findById(userId);

        // Check if the user exists and if the refresh token is valid for that user
        if (!user || user.refreshToken !== refreshToken) {
            throw new Error('Invalid refresh token');
        }

        const newAccessToken = generateAccessToken(userId);

        res.send(newAccessToken);
    } catch (error) {
        console.log('an error occurred when setting new access token', error)
    }
});

router.get('/logout',  async (req, res) => {
    res.clearCookie('accessToken', {domain: `${process.env.BOOKS_DOMAIN}`});
    res.clearCookie('accessToken', {domain: `${process.env.AUTHOR_DOMAIN}`});
    res.clearCookie('refreshToken', {domain: `${process.env.BOOKS_DOMAIN}`});
    res.clearCookie('refreshToken', {domain: `${process.env.AUTHOR_DOMAIN}`});
    res.redirect('/auth');
});


// Function to generate access token
const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: '5m' });
};

// Function to generate refresh token
const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '1d' });
};


module.exports = router