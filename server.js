require('dotenv').config()
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const PORT = process.env.AUTH_PORT || 3002
require('./dbConfig/config')

const passport = require('./passport')
app.use(passport.initialize())

app.use(cookieParser())
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', 'views')
app.set('layout', 'layouts/authLayout')
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(express.urlencoded({ limit: '10mb', extended: false }))

const authRouter = require('./routes/authRoutes')
app.use('/auth', authRouter)

app.listen(PORT, () => {
    console.log(`Auth service is running on port ${PORT}`)
})