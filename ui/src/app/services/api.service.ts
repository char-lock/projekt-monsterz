import { Injectable } from "@angular/core";

import axios from "axios";
import { AxiosHeaders } from "axios";

import { ApiResponse } from "../types/ApiResponse";
import { User } from "../types/User";

@Injectable()
export class ApiService {

  static API_ENDPOINT = "http://localhost:8080";

  constructor() { }

  PostGeneric(endpoint: string, body?: string, headers?: AxiosHeaders) {
    if (!headers) headers = new AxiosHeaders();
    headers?.set("Access-Control-Allow-Origin", ApiService.API_ENDPOINT);
    headers?.set("Content-Type", "application/json");
    return axios.post(
      `${ApiService.API_ENDPOINT}${endpoint}`,
      body,
      { headers: headers }
    )
      .then((postResponse) => {
        const response: ApiResponse = postResponse.data;
        return response;
      })
      .catch((postFailReason) => {
        const response: ApiResponse = { statusCode: 500, details: postFailReason, data: [] };
        return response;
      });
  }

  GetGeneric(endpoint: string, headers?: AxiosHeaders) {
    if (!headers) headers = new AxiosHeaders();
    headers?.set("Access-Control-Allow-Origin", ApiService.API_ENDPOINT);
    return axios.get(
      `${ApiService.API_ENDPOINT}${endpoint}`,
      { headers: headers }
    )
      .then((getResponse) => {
        const response: ApiResponse = getResponse.data;
        return response;
      })
      .catch((getFailReason) => {
        const response: ApiResponse = { statusCode: 500, details: getFailReason, data: [] };
        return response;
      });
  }

  GetAuthToken(username: string, password: string) {
    return this.PostGeneric("/auth/login", `{ "username": "${username}", "password": "${password}" }`)
      .then((authResponse) => {
        if (typeof authResponse.data === "undefined") {
          return "";
        }
        if (authResponse.data.length < 1) {
          return "";
        }
        const token: string = authResponse.data[0].token;
        return token;
      })
      .catch((authFailReason) => {
        console.log(`Failed to retrieve auth token: ${authFailReason}`);
        return "";
      });
  }

  GetUserById(userId: number) {
    return this.GetGeneric(`/user/id/${userId}`)
      .then((userResponse) => {
        if (typeof userResponse.data === "undefined") return undefined;
        if (userResponse.data.length < 1) return undefined;
        const user: User = userResponse.data[0];
        return user;
      })
      .catch((userFailReason) => {
        console.log(`Failed to get user from id: ${userFailReason}`);
        return undefined;
      });
  }

  GetUserByUsername(username: string) {
    return this.GetGeneric(`/user/username/${username}`)
      .then((userResponse) => {
        if (typeof userResponse.data === "undefined") return undefined;
        if (userResponse.data.length < 1) return undefined;
        const user: User = userResponse.data[0];
        return user;
      })
      .catch((userFailReason) => {
        console.log(`Failed to get user from username: ${userFailReason}`);
        return undefined;
      });
  }

  GetUserByValidationValue(value: string) {
    return this.GetGeneric(`/user/validation/${value}`)
      .then((userResponse) => {
        if (typeof userResponse.data === "undefined") return undefined;
        if (userResponse.data.length < 1) return undefined;
        const user: User = userResponse.data[0];
        return user;
      })
      .catch((userFailReason) => {
        console.log(`Failed to get user from validation value: ${userFailReason}`);
        return undefined;
      })
  }

  RefreshAuthToken(currentToken: string) {
    return this.GetGeneric(`/auth/refresh`, new AxiosHeaders({ "Authorization": `Bearer ${currentToken}` }))
      .then((refreshResponse) => {
        if (typeof refreshResponse.data === "undefined") return "";
        if (refreshResponse.data.length < 1) return "";
        const newToken: string = refreshResponse.data[0].token;
        return newToken;
      })
      .catch((refreshFailReason) => {
        console.log(`Failed to refresh token: ${refreshFailReason}`);
        return "";
      });
  }

  RegisterUser(user: User) {
    return this.PostGeneric("/user/", JSON.stringify(user))
      .then((registerResponse) => {
        if (typeof registerResponse.data === "undefined") return undefined;
        if (registerResponse.data.length < 1) return undefined;
        const registered: User = registerResponse.data[0];
        return registered;
      })
      .catch((registerFailReason) => {
        console.log(`Failed to register user: ${registerFailReason}`);
        return undefined;
      });
  }

  GetLeaderboardGlobal(callback: Function) {
    return this.GetGeneric("/leaderboard/global")
      .then((leaderboardResponse) => {
        if (typeof leaderboardResponse.data === "undefined") return callback([]);
        if (leaderboardResponse.data.length < 1) return callback([]);
        const leaderboard: (number | string)[][] = leaderboardResponse.data;
        callback(leaderboard);
      })
      .catch((leaderboardFailReason) => {
        console.log(`Failed to retrieve global leaderboard: ${leaderboardFailReason}`);
        return callback([]);
      });
  }

  GetLeaderboardClass(classCode: string, callback: Function) {
    return this.GetGeneric(`/leaderboard/class/${classCode}`)
      .then((leaderboardResponse) => {
        if (typeof leaderboardResponse.data === "undefined") return callback([]);
        if (leaderboardResponse.data.length < 1) return callback([]);
        const leaderboard: (number | string)[][] = leaderboardResponse.data;
        callback(leaderboard);
      })
      .catch((leaderboardFailReason) => {
        console.log(`Failed to retrieve global leaderboard: ${leaderboardFailReason}`);
        return callback([]);
      });
  }

}
