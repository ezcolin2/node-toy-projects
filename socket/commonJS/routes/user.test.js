jest.mock("../schemas/user.js");
const User = require("../schemas/user.js");
jest.mock("passport");
const passport = require("passport");
const {joinUser, loginUser} = require('./user.js');
describe("joinUser", () => {
  test("회원가입 성공", async () => {
    const req = {
        body:{
          nickname: "chulsoo",
          password: "password",
        }
      };
      const res = {
        json: jest.fn(()=>{})
      };
    User.prototype.save = jest.fn().mockReturnValueOnce({
      nickname: "chulsoo",
      password: "password"
    })

    await joinUser(req, res);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      code: 200,
      message: "회원가입 성공",
    });
  });
  test("회원가입 실패 유저 닉네임 중복", async () => {
    User.prototype.save = jest.fn().mockRejectedValue({
      name: 'MongoServerError',
      code: 11000

    })
    const req = {
      body:{
        nickname: "chulsoo",
        password: "password",
      }
    };
    const res = {
      status: jest.fn(()=>res),
      json: jest.fn(()=>{})
    };
    await joinUser(req, res);
    expect(res.json).toHaveBeenCalledWith({
      code: 409,
      message: "유저 이름 중복",
    });
  });
});

describe('loginUser', ()=>{

  const req = {
    body: {
      nickname: 'chulsoo',
      password: 'password',
    },
    login: jest.fn((user, callback)=>{
      callback();
    }),
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn();

  afterEach(()=>{
    jest.clearAllMocks();
  })
  test('로그인 성공', async ()=>{
    const req = {
        body: {
          nickname: 'chulsoo',
          password: 'password',
        },
        login: jest.fn((user, callback)=>{
          callback();
        }),
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();
    passport.authenticate.mockImplementationOnce((strategy, callback) => (req, res, next) => {
      callback(null, { nickname: 'chulsoo', password: 'password' }, { code: 200, message: '로그인 성공' });
    });
    
    await loginUser(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ code: 200, message: '로그인 성공' });
  })
  test('로그인 실패 비밀번호 불일치', async ()=>{
    passport.authenticate.mockImplementationOnce((strategy, callback) => (req, res, next) => {
      callback(null, false, { code: 400, message: "비밀번호가 일치하지 않습니다." });
    });

    await loginUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ code: 404, message: "해당 유저가 존재하지 않습니다." });
  })
  test('로그인 실패 유저 찾지 못 함', async ()=>{
    passport.authenticate.mockImplementationOnce((strategy, callback) => (req, res, next) => {
      callback(null, false, { code: 404, message: "해당 유저가 존재하지 않습니다." });
    });

    await loginUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ code: 404, message: "해당 유저가 존재하지 않습니다." });
  })
})
test('기본 테스트', ()=>{
    expect(1+1).toBe(2)
    expect(1+1).toEqual(2)
    expect(3).toBeLessThan(4)
    expect(1).not.toBeNull()
})