import session from 'express-session';
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