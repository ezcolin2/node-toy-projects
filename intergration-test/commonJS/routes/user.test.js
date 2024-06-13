const express = require("express");
const app = require("../index.js");
const request = require("supertest");
const mongoose = require("mongoose");

const initDB = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

describe("POST /users/join", () => {
  beforeEach(async () => {
    await initDB();
  });
  test("회원가입 성공, 이름 중복 테스트", async () => {
    // 회원가입 성공
    const response = await request(app).post("/users/join").send({
      name: "minsoo",
      password: "minsoo",
    });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      code: 200,
      message: "회원가입 성공",
    });

    // 이름 중복
    const response2 = await request(app).post("/users/join").send({
      name: "minsoo",
      password: "minsoo",
    });
    expect(response2.statusCode).toEqual(409);
    expect(response2.body).toEqual({
      code: 409,
      message: "유저 이름 중복",
    });
  });
});

describe("POST /users/login", () => {
  beforeEach(async () => {
    await initDB();
  });
  // 회원가입 먼저
  test("회원가입 성공", async () => {
    const response = await request(app).post("/users/join").send({
      name: "minsoo",
      password: "minsoo",
    });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      code: 200,
      message: "회원가입 성공",
    });
  });

  // 회원가입 후 로그인
  test("로그인 성공", async () => {
    const response = await request(app).post("/users/join").send({
      name: "minsoo",
      password: "minsoo",
    });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      code: 200,
      message: "회원가입 성공",
    });

    const response2 = await request(app).post("/users/login").send({
      name: "minsoo",
      password: "minsoo",
    });
    expect(response2.statusCode).toEqual(200);
    expect(response2.body).toEqual({
      code: 200,
      message: "로그인 성공",
    });
  });

  test("로그인 실패 - 비밀번호 불일치", async () => {
    const response = await request(app).post("/users/join").send({
      name: "minsoo",
      password: "minsoo",
    });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      code: 200,
      message: "회원가입 성공",
    });

    const response2 = await request(app).post("/users/login").send({
      name: "minsoo",
      password: "minsoo1",
    });
    expect(response2.statusCode).toEqual(400);
    expect(response2.body).toEqual({
      code: 400,
      message: "비밀번호가 일치하지 않습니다.",
    });
  });

  test("로그인 실패 - 유저 없음", async () => {
    const response = await request(app).post("/users/join").send({
      name: "minsoo",
      password: "minsoo",
    });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      code: 200,
      message: "회원가입 성공",
    });

    const response2 = await request(app).post("/users/login").send({
      name: "minsoo1",
      password: "minsoo1",
    });
    expect(response2.statusCode).toEqual(404);
    expect(response2.body).toEqual({
      code: 404,
      message: "해당 유저가 존재하지 않습니다.",
    });
  });
});
