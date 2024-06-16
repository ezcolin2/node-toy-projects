import express from 'express';
import session from 'express-session';
import passport from 'passport';
import passportConfig from './passport/index.js';
import userRouter from './routes/user.js';
import viewRouter from './routes/view.js';
import {connect} from './schemas/index.js';
import webSocket from './socket.js';
import sessionMiddleware from './middlewares/sessionMiddleware.js';

const app = express();


connect();

app.use(express.json());
app.use(sessionMiddleware);
passportConfig();
app.use(passport.initialize());
app.use(passport.session());
app.use('/users', userRouter);
app.use('/views', viewRouter);

export default app;