const session = require('express-session');
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
    
});
module.exports = sessionMiddleware;