import {Server} from "socket.io";
import passport from "passport";
import Room from "./schemas/room.js";
import { isAuthenticated } from "./middlewares/socketAuthMiddleware.js";
import sessionMiddleware from './middlewares/sessionMiddleware.js';
// import { Server } from "http";

export default function socketHandler(server) {
  const io = new Server(server, {
    path: "/socket.io", // 프론트에서 expree 서버의 해당 경로의 socket.io.js에 접근 가능
  });
  io.engine.use(sessionMiddleware);
  // passportConfig()
  io.engine.use(passport.initialize());
  io.engine.use(passport.session());
  io.use(isAuthenticated);
  io.on("connection", async (socket) => {
    console.log(socket.request.session);
    const user = socket.request.user;
    console.log(`${user.name}님께서 접속하셨습니다.`);
    const rooms = await Room.find();
    socket.emit("init", rooms);
    socket.on("disconnect", () => {
      console.log(`${user.name}님께서 접속을 종료하셨습니다.`);
    });
    socket.on("error", (error) => {
      console.error(error);
    });
    socket.on("createRoom", async (roomName) => {
      console.log(`${roomName} 방 생성 요청`);
      const newRoom = new Room({
        name: roomName,
        master: user.name,
      });
      const createdRoom = await newRoom.save();
      io.emit("newRoom", createdRoom);
    });
    socket.on("deleteRoom", async (_id) => {
      const { acknowledged, _ } = Room.deleteOne({ _id });
      if (acknowledged) {
        return res.json({
          code: 200,
          message: "삭제에 성공했습니다.",
        });
      }
      res.status(500).json({
        code: 500,
        message: "삭제에 실패했습니다.",
      });
    });
  });
  const roomNamespace = io.of("/rooms");
  roomNamespace.use(isAuthenticated);

  roomNamespace.on("connection", (socket) => {
    console.log(socket.handshake.query);
    const user = socket.request.user;
    console.log(user);
    const roomId = socket.handshake.query.roomId;
    socket.join(roomId);
    roomNamespace.to(roomId).emit("newMessage", {
      userName: "system",
      message: `${user.name}님께서 입장하셨습니다.`,
    });
    socket.on("disconnect", () => {
      roomNamespace
        .to(roomId)
        .emit("newMessage", {
          userName: "system",
          message: `${user.name}님께서 접속을 종료하셨습니다.`,
        });
      socket.leave(roomId);
    });
    socket.on("error", (error) => {
      console.error(error);
    });
    socket.on("chat", (message) => {
      roomNamespace.to(roomId).emit("newMessage", {
        userName: user.name,
        message,
      });
    });
  });
}
