import express from 'express';
import connect from './schemas/index.js';
import userRouter from './routes/user.js';
import passport from 'passport';
import passportConfig from './passport/index.js';
import session from 'express-session';
import redis from 'redis';
import RedisStore from 'connect-redis';

const app = express();
app.use(express.json());

import dotenv from 'dotenv';
dotenv.config();

const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_ENDPOINT}`,
    password: process.env.REDIS_PASSWORD
});
redisClient.connect().catch(console.error);

app.use(session({
    cookie: {
        path: "/",
        httpOnly: true,
        secure: false,
        maxAge: null
    },
    secret: process.env.SECRET_KEY,
    saveUninitialized: false,
    resave: false,
    store: new RedisStore({ client: redisClient })
}));

passportConfig();
app.use(passport.initialize());
app.use(passport.session());
app.use('/users', userRouter);

app.listen(process.env.SERVER_PORT, () => {
    console.log(`${process.env.SERVER_PORT} 서버 연결`);
});

connect();
