import request from "supertest";
import { expect, it, describe } from "@jest/globals";
import app from "./app";

describe("ApiApp", () => {

  it("should respond to a get request at /", async () => {
    const res = await request(app).get("/");
    expect(res.body.data).toEqual('welcome to projekt monsterz');
  });

  it("should respond to a get request at /users", async () => {
    const res = await request(app).get("/users/");
    expect(res.body.data).toEqual('users endpoint');
  });

  it("should respond to a get request at /auth", async () => {
    const res = await request(app).get("/auth/");
    expect(res.body.data).toEqual('auth endpoint');
  });

  it("should respond to a get request at /leaderboard", async () => {
    const res = await request(app).get("/leaderboard/");
    expect(res.body.data).toEqual('leaderboard endpoint');
  });

  it("should respond to a get request at /courses/", async () => {
    const res = await request(app).get("/courses/");
    expect(res.body.data).toEqual('courses endpoint');
  });
  
  it("should respond to a get request at /class/", async () => {
    const res = await request(app).get("/class/");
    expect(res.body.data).toEqual('class endpoint');
  });
});
