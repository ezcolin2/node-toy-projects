import {Server} from "socket.io";
import passport from "passport";
import Room from "./schemas/room.js";
import {
  isAuthenticated,
  isNotAuthenticated,
} from "./middlewares/socketAuthMiddleware.js";
import sessionMiddleware from './middlewares/sessionMiddleware.js';

// server를 받아서 socket과 연결
export default (server) => {
  const io = new Server(server, {
    path: "/socket.io", // 프론트에서 express 서버의 해당 경로의 socket.io.js에 접근 가능
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
      // socket.disconnect();
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
      console.log(`${_id} 방 삭제 요청`);
      const findRoom = await Room.findOne({_id});
      if (!findRoom) {
        // 찾은 방이 없는 경우에 대한 처리
        io.to(socket.id).emit("error", {
          code: 404,
          message: `방을 찾을 수 없습니다.`
        });
        return; 
      }
      // 만약 방 주인이 아닌 사람이 삭제 요청 보내면 거절
      if (user.name !== findRoom.master){
        io.to(socket.id).emit("error", {
          code: 403,
          message: "방 삭제 권한이 없습니다."
        });
        return;
      }
      const { acknowledged } = await Room.deleteOne({ _id });
      if (acknowledged) {
        io.emit("deletedRoom", {
          code: 200,
          message: `${_id}번 방 삭제에 성공했습니다.`
        });
        return;
      }
      console.log(acknowledged);
      io.to(socket.id).emit("error", {
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
    console.log(socket.handshake.query)
    console.log(`room id : ${roomId}`)
    socket.join(roomId);
    console.log(roomNamespace.adapter.rooms)
    console.log(`접속 인원 : ${roomNamespace.adapter.rooms.get(roomId).size}`);
    roomNamespace.to(roomId).emit("newMessage", {
      userName: "system",
      message: `${user.name}님께서 입장하셨습니다.`,
    });
    socket.on("disconnect", async () => {
      roomNamespace
        .to(roomId)
        .emit("newMessage", {
          userName: "system",
          message: `${user.name}님께서 접속을 종료하셨습니다.`,
        });
      socket.leave(roomId);
      const cnt = roomNamespace.adapter.rooms.get(roomId)?.size || 0
      console.log(`접속 인원 : ${cnt}`);
      // 방에 아무도 없다면 삭제
      if (cnt==0){
        const { acknowledged } = await Room.deleteOne({ _id : roomId });
        if (acknowledged) {
          io.emit("deletedRoom", {
            code: 200,
            message: `${roomId}번 방 삭제에 성공했습니다.`,
            _id: roomId
          });
          return;
        }
      }
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
};
