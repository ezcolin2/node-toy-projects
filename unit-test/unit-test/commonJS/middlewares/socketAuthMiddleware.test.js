const { isAuthenticated, isNotAuthenticated } = require("./socketAuthMiddleware");
// 로그인 한 사람만 접근가능
describe("isAuthenticated", () => {
  test("인증된 사용자 허용", () => {
    const socket = {
      request:{
        isAuthenticated: jest.fn(() => true),
      }
    };
    const next = jest.fn();
    isAuthenticated(socket, next);
    expect(next).toHaveBeenCalledTimes(1);
  });
  test("인증되지 않은 사용자 허용 X", () => {
    const socket = {
      request:{
        isAuthenticated: jest.fn(() => false),
      }
    };
    const next = jest.fn();
    isAuthenticated(socket, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(new Error(JSON.stringify({
      code: 401,
      message: "로그인이 필요합니다.",
    })))
  });
});

// 로그인 하지 않은 사람만 접근가능
describe("isNotAuthenticated", () => {
  test("인증되지 않은 사용자 허용", () => {
    const socket = {
      request:{
        isAuthenticated: jest.fn(() =>  false),
      }
    };
    const next = jest.fn();
    isNotAuthenticated(socket, next);
    expect(next).toHaveBeenCalledTimes(1);
  });
  test("인증된 사용자 허용 X", () => {
    const socket = {
      request:{
        isAuthenticated: jest.fn(() => true),
      }
    };
    const next = jest.fn();
    isNotAuthenticated(socket, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(new Error(JSON.stringify({
      code: 401,
      message: "로그아웃이 필요합니다.",
    })))
  });
});

