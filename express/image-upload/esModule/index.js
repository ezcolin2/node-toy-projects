import express from 'express';
import multer, { diskStorage } from 'multer';
import fs from 'fs';
import path from 'path';
import dirname from './dirname.cjs';
const {__dirname} = dirname;
if (!fs.existsSync('images')){
    console.log('images 폴더를 생성합니다.')
    fs.mkdirSync('images');
} else{
    console.log('images 폴더가 존재합니다.')
}

const app = express();
app.listen(8080, ()=>{
    console.log("8080 서버 연결");
})
const upload = multer({
    storage: diskStorage({
        destination(req, file, done){
            done(null, 'images/')
        },
        filename(req, file, done){
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
        limits: {fileSize: 5 * 1024 * 1024}
    })
})
app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'index.html'));
})
app.post('/upload', upload.single('image'), (req, res)=>{
    console.log(req.file);
    res.status(200).json({
        status: 200,
        message: '이미지 업로드에 성공했습니다.'
    })
})