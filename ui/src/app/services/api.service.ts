import { Injectable } from "@angular/core";

import axios, { AxiosResponse } from "axios";
import { AxiosHeaders } from "axios";
import * as CryptoJS from "crypto-js";

import { ApiResponse, CourseContent, CourseLesson, CourseUnit, NewUser, User } from "../types/api.types";
import { LessonContent } from "../types/Content";
import { LoggerService } from "./logger.service";

@Injectable()
export class ApiService {

  static API_ENDPOINT = "http://localhost:9696";

  constructor(private logger: LoggerService) {}

  /** Posts a request to the API server and returns the response. */
  postApiRequest(endpoint: string, body?: string, headers?: AxiosHeaders) {
    if (!headers) headers = new AxiosHeaders();
    headers.set("Access-Control-Allow-Origin", ApiService.API_ENDPOINT);
    headers.set("Content-Type", "application/json");
    return axios.post(
      `${ApiService.API_ENDPOINT}${endpoint}`,
      body,
      { headers: headers }
    )
      .then((rawResponse: AxiosResponse) => {
        return <ApiResponse>rawResponse.data;
      })
      .catch((fail) => {
        this.logger.makeLog(
          "api.service::postApiRequest", 
          `request failed to resolve - reason: ${fail}`
        );
        
        const response: ApiResponse = fail.response.data || {
          statusCode: 500,
          statusShortDesc: "Internal Server Failure",
          statusLongDesc: ""
        };
        return response;
      });
  }

  /** Sends a get request to the API server and returns the response. */
  getApiRequest(endpoint: string, headers?: AxiosHeaders) {
    if (!headers) headers = new AxiosHeaders();
    return axios.get(
      `${ApiService.API_ENDPOINT}${endpoint}`,
      { headers: headers }
    )
      .then((rawResponse) => {
        return <ApiResponse>rawResponse.data;
      })
      .catch((fail) => {
        this.logger.makeLog(
          "api.service::getApiRequest",
          `request failed to resolve - reason: ${fail}`
        );
        const response: ApiResponse = fail.response.data || {
          statusCode: 500,
          statusShortDesc: "Internal Server Failure",
          statusLongDesc: ""
        };
        return response;
      });
  }

  /** 
   * Returns a User object if a user exists with the provided userId,
   * otherwise returns undefined.
   */
  getUserById(userId: number) {
    return this.getApiRequest(`/users/id/${userId}`)
      .then((response) => {
        return <User>response.data;
      })
      .catch((fail) => {
        this.logger.makeLog(
          "api.service::getUserById",
          `request failed to resolve - reason: ${fail}`
        );
        return undefined;
      });
  }

  /** 
   * Returns a User object if a user exists with the provided username,
   * otherwise returns undefined.
   */
  getUserByUsername(username: string) {
    return this.getApiRequest(`/users/username/${username}`)
      .then((response) => {
        return <User>response.data;
      })
      .catch((fail) => {
        this.logger.makeLog(
          "api.service::getUserByUsernames",
          `request failed to resolve - reason: ${fail}`
        );
        return undefined;
      });
  }

  /** 
   * Returns a User object if a user exists with the provided validation
   * value, otherwise returns undefined.
   */
  getUsersByValidationValue(value: string) {
    return this.getApiRequest(`/users/validation/${value}`)
      .then((response) => {
        return <User[]>response.data;
      })
      .catch((fail) => {
        this.logger.makeLog(
          "api.service::getUserByValidationValue",
          `request failed to resolve - reason: ${fail}`
        );
        return [];
      });
  }

  /**
   * Returns a list of User objects organised by position in the course content.
   */
  getUsersByScore(count: number) {
    return this.getApiRequest(`/leaderboard/${count}`)
      .then((users) => {
        if (users.data === undefined) {
          this.logger.makeLog("api.service::getUsersByScore", JSON.stringify(users));
          return <User[]>[];
        }
        return <User[]>users.data;
      })
      .catch((reject) => {
        this.logger.makeLog("api.service::getUsersByScore", reject);
        return <User[]>[];
      });
  }

  /**
   * Returns a list of User objects organised by position in the course content
   * and filtered by validation value.
   */
  getClassUsersByScore(educationCode: string, count: number) {
    return this.getApiRequest(`/leaderboard/class/${educationCode}/${count}`)
      .then((users) => {
        if (users.data === undefined) {
          this.logger.makeLog("api.service::getClassUsersByScore", JSON.stringify(users));
          return <User[]>[];
        }
        return <User[]>users.data;
      })
      .catch((reject) => {
        this.logger.makeLog("api.service::getClassUsersByScore", reject);
        return <User[]>[];
      });
  }

  /** 
   * Registers a user with the provided information, and returns the
   * created user if the request is successful.
   */
  registerUser(user: NewUser) {
    this.logger.makeLog("api.service::registerUser", `registering user:\n${JSON.stringify(user)}`);
    return this.postApiRequest("/users/", JSON.stringify(user))
      .then((response) => {
        return <User>response.data;
      })
      .catch((fail) => {
        this.logger.makeLog(
          "api.service::registerUser", 
          `request failed to resolve - reson: ${fail}`
        );
        return undefined;
      });
  }

  /** 
   * Returns either an authorization token if the username and password are valid,
   * or returns an empty string.
   */
  getAuthToken(username: string, password: string) {
    password = CryptoJS.SHA512(password).toString(CryptoJS.enc.Hex);
    this.logger.makeLog("api.service::getAuthToken", `attempting to login with credentials: { username: ${username}, password: ${password} }`);
    return this.postApiRequest(
      "/auth/login",
      `{
        "username": "${username}",
        "password": "${password}"
      }`
    )
      .then((response) => {
        if (response.data === undefined) return ""
        return <string>response.data;
      })
      .catch((fail) => {
        this.logger.makeLog(
          "api.service::getAuthToken", 
          `request failed to resolve - reason: ${fail}`
        );
        return "";
      });
  }

  /** Returns a new authorization token for the provided information. */
  refreshAuthToken(currentToken: string) {
    return this.getApiRequest(
      "/auth/refresh", 
      new AxiosHeaders({ "Authorization": `Bearer ${currentToken}` })
    )
      .then((response) => {
        if (response.data === undefined) return "";
        return <string>response.data;
      })
      .catch((fail) => {
        this.logger.makeLog(
          "api.service::refreshAuthToken", 
          `failed to refresh token - reason ${fail}`
        );
        return "";
      });
  }

  /** Returns the metadata related to the provided unit ID */
  getUnitMeta(unitId: number) {
    return this.getApiRequest(`/course/units/${unitId}/metadata`)
      .then((result) => {
        if (result.data === undefined) {
          this.logger.makeLog("api.service::getUnitMeta", JSON.stringify(result));
        }
        return <CourseUnit>result.data;
      })
      .catch((reject) => {
        this.logger.makeLog("api.service::getUnitMeta", JSON.stringify(reject));
        return undefined;
      });
  }

  /** Returns the metadata related to the provided lesson ID */
  getLessonMeta(lessonId: number) {
    return this.getApiRequest(`/course/lessons/${lessonId}/metadata`)
      .then((result) => {
        if (result.data === undefined) {
          this.logger.makeLog("api.service::getUnitMeta", JSON.stringify(result));
        }
        return <CourseLesson>result.data;
      })
      .catch((reject) => {
        this.logger.makeLog("api.service::getUnitMeta", JSON.stringify(reject));
        return undefined;
      });
  }

  /** Returns the content metadata related to the provided content ID */
  getContentMeta(contentId: number) {
    return this.getApiRequest(`/course/content/${contentId}`)
      .then((result) => {
        if (result.data === undefined) {
          this.logger.makeLog("api.service::getUnitMeta", JSON.stringify(result));
        }
        return <CourseContent>result.data;
      })
      .catch((reject) => {
        this.logger.makeLog("api.service::getUnitMeta", JSON.stringify(reject));
        return undefined;
      });
  }

  /** Returns the content details for the provided lesson and content position. */
  getContentByPosition(lessonId: number, position: number) {
    return this.getApiRequest(`/course/lessons/${lessonId}/content/${position}`)
      .then((result) => {
        if (result.data === undefined || result.data.length === 0) {
          this.logger.makeLog("api.service::getContentByLesson", JSON.stringify(result));
          return undefined;
        }
        return <CourseContent>result.data;
      })
      .catch((reject) => {
        this.logger.makeLog("api.service::getContentByLesson", JSON.stringify(reject));
        return undefined;
      });
  }

  /** Returns all content related to a provided lesson ID. */
  getContentByLesson(lessonId: number) {
    return this.getApiRequest(`/course/lessons/${lessonId}/content`)
      .then((result) => {
        if (result.data === undefined || result.data.length === 0) {
          this.logger.makeLog("api.service::getContentByLesson", JSON.stringify(result));
          return [];
        }
        return <CourseContent[]>result.data;
      })
      .catch((reject) => {
        this.logger.makeLog("api.service::getContentByLesson", JSON.stringify(reject));
        return [];
      });
  }

}
