import { expect, it, describe, beforeEach, afterEach } from "@jest/globals";
import request from "supertest";
import app from "../../app";
import { ValidationMethod } from "./users.types";
import { User } from "@prisma/client";

describe("Routes -> Users", () => {

  let userInfo: User;

  beforeEach(async () => {
    const newUser = {
      username: "jestUser123",
      password: "jestPassword",
      validation_method: ValidationMethod.EMAIL,
      validation_value: "jest@jest.com"
    };
    const createUserResponse = await request(app).post("/users/").send(newUser);
    expect(createUserResponse.body.statusCode).toEqual(201);
    expect(createUserResponse.body.data.username).toEqual(newUser.username);
    userInfo = createUserResponse.body.data;
  });

  afterEach(async () => {
    const deleteUserResponse = await request(app).delete(`/users/id/${userInfo.id}`);
    expect(deleteUserResponse.body.statusCode).toEqual(200);
    expect(deleteUserResponse.body.data).toBeUndefined();
  });

  it(`should fail to create a user with an existing username`, async () => {
    const newUser = {
      username: userInfo.username,
      password: "jestPassword",
      validation_method: ValidationMethod.EMAIL,
      validation_value: "jest123@jest.com"
    };
    const createUserResponse = await request(app).post("/users/").send(newUser);
    expect(createUserResponse.body.statusCode).toEqual(400);
    expect(createUserResponse.body.data).toBeUndefined();
  });

  it('should fail to create a user with an existing email', async () => {
    const newUser = {
      username: "jestUser1234",
      password: "jestPassword",
      validation_method: ValidationMethod.EMAIL,
      validation_value: userInfo.validation_value
    };
    const createUserResponse = await request(app).post("/users/").send(newUser);
    expect(createUserResponse.body.statusCode).toEqual(400);
    expect(createUserResponse.body.data).toBeUndefined();
  });

  it(`should create new users with the same education code`, async () => {
    const newUser = {
      username: "jestUser1234",
      password: "jestPassword",
      validation_method: ValidationMethod.EDUCATION_CODE,
      validation_value: "jest123"
    };
    const createUserResponse = await request(app).post("/users/").send(newUser);
    expect(createUserResponse.body.statusCode).toEqual(201);
    expect(createUserResponse.body.data.username).toEqual(newUser.username);
    const newUser2 = {
      username: "jestUser12345",
      password: "jestPassword",
      validation_method: ValidationMethod.EDUCATION_CODE,
      validation_value: "jest123"
    };
    const createUserResponse2 = await request(app).post("/users/").send(newUser2);
    expect(createUserResponse2.body.statusCode).toEqual(201);
    expect(createUserResponse2.body.data.username).toEqual(newUser2.username);
    await request(app).delete(`/users/id/${createUserResponse.body.data.id}`);
    await request(app).delete(`/users/id/${createUserResponse2.body.data.id}`);
  });

  it(`should succeed to delete even a non-existant user`, async () => {
    const deleteUserResponse = await request(app).delete(`/users/id/99`);
    expect(deleteUserResponse.body.statusCode).toEqual(200);
    expect(deleteUserResponse.body.data).toBeUndefined();
  });

  it("should get a user by id", async () => {
    const getUserResponse = await request(app).get(`/users/id/${userInfo.id}`);
    expect(getUserResponse.body.statusCode).toEqual(200);
    expect(getUserResponse.body.data).toBeDefined();
    expect(getUserResponse.body.data.username).toEqual(userInfo.username);
    expect(getUserResponse.body.data.password).toBeUndefined();
    expect(getUserResponse.body.data.id).toEqual(userInfo.id);
  });

  it('should fail to get a non-existant user by id', async () => {
    const getUserResponse = await request(app).get(`/users/id/99`);
    expect(getUserResponse.body.statusCode).toEqual(404);
    expect(getUserResponse.body.data).toBeUndefined();
  });

  it("should get a user by username", async () => {
    const getUserResponse = await request(app).get(`/users/username/${userInfo.username}`);
    expect(getUserResponse.body.statusCode).toEqual(200);
    expect(getUserResponse.body.data).toBeDefined();
    expect(getUserResponse.body.data.username).toEqual(userInfo.username);
    expect(getUserResponse.body.data.password).toBeUndefined();
    expect(getUserResponse.body.data.id).toEqual(userInfo.id);
  });

  it(`should fail to get a non-existant user by username`, async () => {
    const getUserResponse = await request(app).get(`/users/username/jestUser1234`);
    expect(getUserResponse.body.statusCode).toEqual(404);
    expect(getUserResponse.body.data).toBeUndefined();
  });

  it("should get a user by validation value", async () => {
    const getUserResponse = await request(app).get(`/users/validation/${userInfo.validation_value}`);
    expect(getUserResponse.body.statusCode).toEqual(200);
    expect(getUserResponse.body.data).toBeDefined();
    expect(getUserResponse.body.data.length).toEqual(1);
    const responseUser = getUserResponse.body.data[0];
    expect(responseUser.username).toEqual(userInfo.username);
    expect(responseUser.password).toBeUndefined();
    expect(responseUser.id).toEqual(userInfo.id);
  });

  it(`should fail to get a non-existant user by validation value`, async () => {
    const getUserResponse = await request(app).get(`/users/validation/jester@jest.com`);
    expect(getUserResponse.body.statusCode).toEqual(404);
    expect(getUserResponse.body.data).toBeUndefined();
  });

});
