const webSocket = require("./socket.js");
const { createServer } = require("node:http");
const app = require("./server.js");
const ioc = require("socket.io-client");
const session = require("express-session");
const request = require("supertest");
const mongoose = require("mongoose");
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
    webSocket(server);
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
    clientSocket = ioc(`http://localhost:${process.env.SERVER_PORT}`, {
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
  let newLoginResponse;
  let server;
  let clientSocket;

  // 시작하기 전에 로그인, 세션 접속
  beforeAll(async () => {
    await initDB();
    server = app.listen(process.env.SERVER_PORT, () => {
      console.log(`${process.env.SERVER_PORT} 포트 연결`);
    });
    webSocket(server);
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

    // 새로운 유저 생성
    const newJoinResponse = await request(app).post("/api/v1/users/join").send({
      name: "chulsoo",
      password: "chulsoo",
    });
    expect(newJoinResponse.statusCode).toEqual(200);
    expect(newJoinResponse.body).toEqual({
      code: 200,
      message: "회원가입 성공",
    });

    newLoginResponse = await request(app).post("/api/v1/users/login").send({
      name: "chulsoo",
      password: "chulsoo",
    });
    expect(newLoginResponse.statusCode).toEqual(200);
    expect(newLoginResponse.body).toEqual({
      code: 200,
      message: "로그인 성공",
    });
  });
  // 테스트가 끝날 때마다 모든 이벤트 제거
  afterEach(() => {
    clientSocket.removeAllListeners();
  });
  // 테스트가 모두 끝나면 서버 종료
  afterAll(() => {
    // 서버 종료
    clientSocket.disconnect();
    server.close();
  });

  test("채팅방 생성, 삭제 성공", (done) => {
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
    let room;
    clientSocket.on("newRoom", (createdRoom) => {
      console.log(`새로운 방 정보 ${createdRoom._id}`);
      room = createdRoom;
      clientSocket.emit("deleteRoom", createdRoom._id);
    });
    clientSocket.on("deletedRoom", (res) => {
      expect(res).toEqual({
        code: 200,
        message: `${room._id}번 방 삭제에 성공했습니다.`,
      });
      done();
    });
    clientSocket.on("error", (error) => {
      console.log(error);
      throw new Error(JSON.stringify(error));
    });
    // 채팅방 생성
    clientSocket.emit("createRoom", "testName");
    //
  });

  test("채팅방 삭제 실패 - 권한 없음", (done) => {
    // 새로운 유저로 소켓 연결
    const newClientSocket = ioc(`http://localhost:${process.env.SERVER_PORT}`, {
      path: "/socket.io",
      extraHeaders: {
        Cookie: newLoginResponse.headers["set-cookie"],
      },
    });
    newClientSocket.on("init", (rooms) => {
      // 처음에는 방들이 0개
      expect(rooms.length).toBe(0);
      clientSocket.emit("createRoom", "testRoom123");
      // clientSocket.disconnect();
    });
    let room;
    newClientSocket.on("error", (error) => {
      expect(error).toEqual({ code: 403, message: "방 삭제 권한이 없습니다." });
      done();
    });
    clientSocket.on("newRoom", (createdRoom) => {
      console.log(`받은 방 정보 : ${createdRoom}`);
      expect(createdRoom.name).toBe("testRoom123");
      // 기존 유저가 아닌 새로운 유저가 해당 방 삭제 시도
      newClientSocket.emit("deleteRoom", createdRoom._id);
    });
    // 기존 유저의 방 생성
  });

  test("채팅방 삭제 실패 - 방 없음", (done)=>{
    clientSocket.on("error", (error)=>{
      expect(error).toEqual({
        code: 404,
        message: `방을 찾을 수 없습니다.`
      })
      done();
    })
    // mongoDB _id 규칙에서 벗어나는 것을 삭제해서 404 테스트
    clientSocket.emit("deleteRoom", "ffffffffffffffffffffffff");
  })
});
