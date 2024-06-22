const webSocket = require('./socket.js')
const app = require('./server.js');
const server = app.listen(process.env.SERVER_PORT, ()=>{
    console.log(`${process.env.SERVER_PORT} 포트 서버 연결`)
})


webSocket(server)