import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connect = () => {
    mongoose.connect(`mongodb://${process.env.MONGODB_URL}/${process.env.MONGODB_NAME}`)
    .then(() => {
        console.log("mongodb 연결 성공");
    })
    .catch((error) => {
        console.log(error);
    });
    mongoose.connection.on('error', (error) => {
        console.log(error);
    });
    mongoose.connection.on('disconnected', () => {
        console.log("연결 실패 재연결 시도합니다.");
        connect();
    });
};

export default connect;
