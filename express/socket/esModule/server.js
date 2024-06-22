import express from 'express';
import passport from 'passport';
import passportConfig from './passport/index.js';
import userRouter from './routes/user.js';
import viewRouter from './routes/view.js';
import {connect} from './schemas/index.js';
import sessionMiddleware from './middlewares/sessionMiddleware.js';
import dotenv from './dotenv/index.js';
import morgan from 'morgan';

// NODE_ENV 세팅
dotenv();
const app = express();
if (process.env.NODE_ENV === 'production') { 
  app.use(morgan('combined')); // 배포환경이면
} else {
  app.use(morgan('dev')); // 개발환경이면
}
출처: https://inpa.tistory.com/entry/EXPRESS-📚-morgan-미들웨어 [Inpa Dev 👨‍💻:티스토리]

connect();

app.use(express.json());
app.use(sessionMiddleware);
passportConfig();
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/v1/users', userRouter);
app.use('/views', viewRouter);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({status:500, message: 'internal error', type:'internal'});
});
export default app;