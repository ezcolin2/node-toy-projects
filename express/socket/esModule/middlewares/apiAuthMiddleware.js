const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({
    code: 401,
    message: "로그인이 필요합니다.",
  });
};

const isNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({
    code: 401,
    message: "로그아웃이 필요합니다.",
  });
};

export { isAuthenticated, isNotAuthenticated };
