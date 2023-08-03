import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import * as Express from "express";
import { ApiResponse } from "./api.response";

describe("ApiResponse", () => {

  let rawRes: jest.MockedObject<Express.Response>;

  beforeEach(() => {
    rawRes = {
      status: jest.fn(() => rawRes),
      json: jest.fn()
    } as unknown as jest.MockedObject<Express.Response>;
  });

  it('should create a new ApiResponse instance', () => {
    const res = new ApiResponse(rawRes);
    expect(res).toBeInstanceOf(ApiResponse);
  });

  it('should initialise with as a 200 OK response', () => {
    const res = new ApiResponse(rawRes);
    expect(res.getResponseCode()).toBe(200);
    expect(res.getResponseShortDesc()).toBe("OK");
    expect(res.getResponseLongDesc()).toBe("");
  });

  it('should set the response code and return itself', () => {
    const res = new ApiResponse(rawRes);
    expect(res.status(201)).toBeInstanceOf(ApiResponse);
    expect(res.getResponseCode()).toBe(201);
    expect(res.getResponseShortDesc()).toBe("Created");
    expect(res.getResponseLongDesc()).toBe("");
  });

  it('should set the response description and return itself', () => {
    const res = new ApiResponse(rawRes);
    expect(res.describe("test")).toBeInstanceOf(ApiResponse);
    expect(res.getResponseLongDesc()).toBe("test");
  });

  it('should send the response with the proper status', () => {
    const res = new ApiResponse(rawRes);
    const spy = jest.spyOn(rawRes, "status");
    res.send();
    expect(spy).toHaveBeenCalledWith(200);
    res.status(201).send();
    expect(spy).toHaveBeenCalledWith(201);
  });

  it('should send the response with the proper data', () => {
    const res = new ApiResponse(rawRes);
    const spy = jest.spyOn(rawRes, "json");
    res.send();
    expect(spy).toHaveBeenCalledWith({
      statusCode: 200,
      statusShortDesc: "OK",
      statusLongDesc: "",
      data: undefined
    });
    res.send("test");
    expect(spy).toHaveBeenCalledWith({
      statusCode: 200,
      statusShortDesc: "OK",
      statusLongDesc: "",
      data: "test"
    });
  });

});