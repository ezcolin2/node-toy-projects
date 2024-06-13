import { isAuthenticated, isNotAuthenticated } from './apiAuthMiddleware.js';
// 로그인 한 사람만 접근가능
describe("isAuthenticated", () => {
  test("인증된 사용자 허용", () => {
    const req = {
      isAuthenticated: jest.fn(() => true),
    };
    const res = {
    };
    const next = jest.fn();
    isAuthenticated(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });
  test("인증되지 않은 사용자 허용 X", () => {
    const req = {
      isAuthenticated: jest.fn(() => false),
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    const next = jest.fn();
    isAuthenticated(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      code: 401,
      message: "로그인이 필요합니다.",
    });
  });
});

// 로그인 하지 않은 사용자만 접근 가능
describe("isAuthenticated", () => {
  test("인증되지 않은 사용자 허용", () => {
    const req = {
      isAuthenticated: jest.fn(() => false),
    };
    const res = {
    };
    const next = jest.fn();
    isNotAuthenticated(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });
  test("인증되지 않은 사용자 허용 X", () => {
    const req = {
      isAuthenticated: jest.fn(() => true),
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    const next = jest.fn();
    isNotAuthenticated(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      code: 401,
      message: "로그아웃이 필요합니다.",
    });
  });
});