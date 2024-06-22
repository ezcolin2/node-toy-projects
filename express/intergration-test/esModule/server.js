import app from './index.js';

app.listen(process.env.SERVER_PORT, ()=>{
    console.log(`${process.env.SERVER_PORT} 포트 서버 연결`)
})
