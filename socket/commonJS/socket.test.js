const webSocket = require("./socket.js");
const { createServer } = require("node:http");
const app = require("./server.js");
const ioc = require("socket.io-client");
const session = require("express-session");
const request = require("supertest");
const mongoose = require("mongoose");
const sessionMiddleware = require("./middlewares/sessionMiddleware.js");
const initDB = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};
describe("소켓 연결 테스트", () => {
  let loginResponse;
  let server;
  let clientSocket;
  beforeAll(async () => {
    await initDB();
    server = app.listen(process.env.SERVER_PORT, () => {
      console.log(`${process.env.SERVER_PORT} 포트 연결`);
    });
    webSocket(server, sessionMiddleware);
    const joinResponse = await request(app).post("/api/v1/users/join").send({
      name: "minsoo",
      password: "minsoo",
    });
    expect(joinResponse.statusCode).toEqual(200);
    expect(joinResponse.body).toEqual({
      code: 200,
      message: "회원가입 성공",
    });

    loginResponse = await request(app).post("/api/v1/users/login").send({
      name: "minsoo",
      password: "minsoo",
    });
    expect(loginResponse.statusCode).toEqual(200);
    expect(loginResponse.body).toEqual({
      code: 200,
      message: "로그인 성공",
    });
  });
  afterAll(() => {
    // 서버 종료
    server.close();
  });
  afterEach(() => {
    clientSocket.disconnect();
  });
  test("소켓 연결 실패 - 인증 실패", (done) => {
    clientSocket = ioc(`http://localhost:3002`, {
      path: "/socket.io",
    });
    clientSocket.on("connect_error", (error) => {
      expect(error.message).toEqual(
        JSON.stringify({
          code: 401,
          message: "로그인이 필요합니다.",
        })
      );
      clientSocket.disconnect();
      done();
    });
  });

  test("소켓 연결 성공", (done) => {
    console.log(loginResponse.headers["set-cookie"]);
    clientSocket = ioc(`http://localhost:3002`, {
      path: "/socket.io",
      extraHeaders: {
        Cookie: loginResponse.headers["set-cookie"],
      },
    });
    clientSocket.on("init", (rooms) => {
      // 처음에는 방들이 0개
      expect(rooms.length).toBe(0);
      clientSocket.disconnect();
      done();
    });
    clientSocket.on("connect_error", (error) => {
      console.log("에러 발생");
      console.log(error.message);
    });
  });
});

describe("소켓 채팅방 테스트", () => {
  let loginResponse;
  let server;
  let clientSocket;

  // 시작하기 전에 로그인, 세션 접속
  beforeAll(async () => {
    await initDB();
    server = app.listen(process.env.SERVER_PORT, () => {
      console.log(`${process.env.SERVER_PORT} 포트 연결`);
    });
    webSocket(server, sessionMiddleware);
    const joinResponse = await request(app).post("/api/v1/users/join").send({
      name: "minsoo",
      password: "minsoo",
    });
    expect(joinResponse.statusCode).toEqual(200);
    expect(joinResponse.body).toEqual({
      code: 200,
      message: "회원가입 성공",
    });

    loginResponse = await request(app).post("/api/v1/users/login").send({
      name: "minsoo",
      password: "minsoo",
    });
    expect(loginResponse.statusCode).toEqual(200);
    expect(loginResponse.body).toEqual({
      code: 200,
      message: "로그인 성공",
    });
    // clientSocket = ioc(`http://localhost:${process.env.SERVER_PORT}`, {
    //   path: "/socket.io",
    //   extraHeaders: {
    //     Cookie: loginResponse.headers["set-cookie"],
    //   },
    // });
    // clientSocket.on("init", (rooms) => {
    //   // 처음에는 방들이 0개
    //   expect(rooms.length).toBe(0);
    //   clientSocket.disconnect();
    // });
  });

  // 테스트가 모두 끝나면 서버 종료
  afterAll(() => {
    // 서버 종료
    clientSocket.disconnect();
    server.close();
  });


  test("채팅방 생성, 삭제", (done)=>{
    clientSocket = ioc(`http://localhost:${process.env.SERVER_PORT}`, {
      path: "/socket.io",
      extraHeaders: {
        Cookie: loginResponse.headers["set-cookie"],
      },
    });
    clientSocket.on("init", (rooms) => {
      // 처음에는 방들이 0개
      expect(rooms.length).toBe(0);
      // clientSocket.disconnect();
    });

    let createdRoom;
    clientSocket.on("newRoom", (createdRoom)=>{
      console.log(createdRoom);
      createdRoom = createdRoom;
    })
    clientSocket.on("")
    // 채팅방 생성
    clientSocket.emit("createRoom", "testName");

    // 
  })
});
