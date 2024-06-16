import app from './server.js'
import webSocket from './socket.js';
import dotenv from './dotenv/index.js';

const server = app.listen(process.env.SERVER_PORT, () => {
  console.log(`${process.env.SERVER_PORT} 포트 서버 연결`);
});

webSocket(server);
