const isAuthenticated = (socket, next) => {
  console.log(socket.handshake.headers)
  console.log(`세션 데이터 : ${JSON.stringify(socket.request.session)}`);
  console.log(socket.request?.user)
  if (socket.request.isAuthenticated()) {
    return next();
    
  }
  next(new Error(JSON.stringify({
    code: 401,
    message: "로그인이 필요합니다.",
  })));
};

const isNotAuthenticated = (socket, next) => {
  if (!socket.request.isAuthenticated()) {
    return next();
  }
  next(new Error(JSON.stringify({
    code: 401,
    message: "로그아웃이 필요합니다.",
  })));
};

export { isAuthenticated, isNotAuthenticated };
