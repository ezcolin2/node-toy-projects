const express = require('express')
const session = require('express-session')
const passport = require('passport')
const passportConfig = require('./passport')
const userRouter = require('./routes/user')
const connect = require('./schemas/index')

const dotenv = require("./config/dotenv");
dotenv();
app = express()
const sessionMiddleware = session({
    cookie: {
        path: "/",
        httpOnly: true,
        secure: false,
        maxAge: null
    },
    secure: false,
    secret: 'secretkey',
    saveUninitialized: false,
    resave: false,
    
})
connect()
app.use(express.json())
app.use(sessionMiddleware)
passportConfig()
app.use(passport.initialize())
app.use(passport.session())
app.use('/users', userRouter)

module.exports = app;

