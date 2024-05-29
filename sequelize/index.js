import express from "express";
import db from './database/models/index.js'
import {User} from './database/models/index.js'
const app = express()
app.use(express.json())
app.listen(3001, ()=>{
    console.log("3001 포트에 서버 실행")
})

db.sequelize
  .sync()
  .then(() => console.log("데이터베이스 연결"))
  .catch(err => console.error('데이터베이스 연결 실패', err))

app.post("/users", (req, res)=>{
    const {name, age} = req.body
    User.create({
        name,
        age
    })
    
})