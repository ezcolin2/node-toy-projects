import express from 'express'
import imageRouter from './routes/image.js';
import dirname from './dirname.cjs';
import path from 'path';
const {__dirname} = dirname;
const app = express();
app.use('/images', imageRouter);
app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'views', 'main.html'));
})
app.listen(3000, ()=>{
    console.log("3000 서버 연결");
})