import session from 'express-session';
import dotenv from '../dotenv/index.js';
dotenv();
const sessionMiddleware = session({
    cookie: {
      path: "/",
      httpOnly: true,
      secure: false,
      maxAge: null
    },
    secure: false,
    secret: process.env.SECRET_KEY,
    saveUninitialized: false,
    resave: false
  });
export default sessionMiddleware;