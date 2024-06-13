import express from 'express';
import session from 'express-session';
import passport from 'passport';
import passportConfig from './passport/index.js'; 
import userRouter from './routes/user.js';
import connect from './schemas/index.js';

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

export default app;

