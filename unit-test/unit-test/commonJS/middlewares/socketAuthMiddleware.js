module.exports = {
    isAuthenticated: (socket, next) => {
      if (socket.request.isAuthenticated()) {
        return next();
      }
      next(new Error(JSON.stringify(
        {
            code: 401,
            message: "로그인이 필요합니다.",
        })
      ))
    },
    isNotAuthenticated: (socket, next) => {
      if (!socket.request.isAuthenticated()) {
        return next();
      }
      next(new Error(JSON.stringify(
        {
            code: 401,
            message: "로그아웃이 필요합니다.",
        })
      ))
    },
  };
  