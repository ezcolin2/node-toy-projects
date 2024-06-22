const express = require('express')
const connect = require('./schemas/index')
const userRouter = require('./routes/user')
const passport = require('passport')
const passportConfig = require('./passport')
const app = express()
app.use(express.json())
const dotenv = require('dotenv')
const session = require('express-session')
const redis = require('redis')
const RedisStore = require('connect-redis').default
dotenv.config()
const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_ENDPOINT}`,
    password: process.env.REDIS_PASSWORD
})
redisClient.connect().catch(console.error)
app.use(session({
    cookie: {
        path: "/", // 쿠키 저장 경로.
        httpOnly: true, // 클라이언트가 자바스크립트를 통해 쿠키 접근 불가.
        secure: false, // https에서만 사용 여부. 로컬에서 http로 테스트 할 예정이므로 false.
        maxAge: null // 만료 시간. null이면 무한
    },
    secure: false, // https에서만 사용 여부. 로컬에서 http로 테스트 할 예정이므로 false.
    secret: process.env.SECRET_KEY, // 시크릿 키. 
    saveUninitialized: false, // 세션이 변경되지 않았을 때 세션은 초기화 되지 않지만 true로 두면 초기화 됨. 
    resave: false, // 변경 사항이 없어도 항상 세션을 저장할지
    store: new RedisStore({client: redisClient})
}))

passportConfig()
app.use(passport.initialize())
app.use(passport.session())
app.use('/users', userRouter)
app.listen(process.env.SERVER_PORT, ()=>{
    console.log(`${process.env.SERVER_PORT} 서버 연결`)
})
connect()
