const express = require('express')
const session = require('express-session')
const passport = require('passport')
const passportConfig = require('./passport')
const userRouter = require('./routes/user')
const viewRouter = require('./routes/view')
const connect = require('./schemas/index')

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
app.use('/views', viewRouter)

const webSocket = require('./socket.js')
const server = app.listen(process.env.SERVER_PORT, ()=>{
    console.log(`${process.env.SERVER_PORT} 포트 서버 연결`)
})


webSocket(server, sessionMiddleware)