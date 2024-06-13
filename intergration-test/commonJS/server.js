const app = require('./index');

app.listen(process.env.SERVER_PORT, ()=>{
    console.log(`${process.env.SERVER_PORT} 포트 서버 연결`)
})
