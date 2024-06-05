import express from 'express';
import session from 'express-session';
import passport from 'passport';
import passportConfig from './passport/index.js';
import userRouter from './routes/user.js';
import viewRouter from './routes/view.js';
import connect from './schemas/index.js';
import webSocket from './socket.js';

const app = express();
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
  resave: false
});

connect();

app.use(express.json());
app.use(sessionMiddleware);
passportConfig();
app.use(passport.initialize());
app.use(passport.session());
app.use('/users', userRouter);
app.use('/views', viewRouter);

const server = app.listen(process.env.SERVER_PORT, () => {
  console.log(`${process.env.SERVER_PORT} 포트 서버 연결`);
});

webSocket(server, sessionMiddleware);
