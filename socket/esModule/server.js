import express from 'express';
import passport from 'passport';
import passportConfig from './passport/index.js';
import userRouter from './routes/user.js';
import viewRouter from './routes/view.js';
import {connect} from './schemas/index.js';
import sessionMiddleware from './middlewares/sessionMiddleware.js';
import dotenv from './dotenv/index.js';

// NODE_ENV 세팅
dotenv();
const app = express();


connect();

app.use(express.json());
app.use(sessionMiddleware);
passportConfig();
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/v1/users', userRouter);
app.use('/views', viewRouter);

export default app;