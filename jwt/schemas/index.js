const mongoose = require('mongoose')

const connect = ()=>{
    if (process.env.NODE_ENV !== 'production'){
        mongoose.set('debug', true)
    }
    mongoose.connect('mongodb://localhost:27017/mongoose_practice')
    .then(()=>{
        console.log("mongodb 연결 성공")
    }).catch((err)=>{
        console.log(err)
    })
    mongoose.connection.on('error', (error)=>{
        console.log(error)
    })
    mongoose.connection.on('disconnected', ()=>{
        console.log("연결 실패 재연결 시도합니다.")
        connect()
    })
}
module.exports = connect