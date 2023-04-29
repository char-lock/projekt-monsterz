import { Injectable } from "@angular/core";

import axios, { AxiosError, AxiosResponse } from "axios";
import { AxiosHeaders } from "axios";
import * as CryptoJS from "crypto-js";

import { 
  ApiResponse, 
  CourseContent, 
  CourseLesson, 
  CourseUnit, 
  NewUser, 
  User 
} from "../types/api.types";
import { LoggerService } from "./logger.service";
import { LeaderboardEntry } from "../types/other.types";

/** 
 * A service that provides an abstraction layer for sending requests
 * to the API and receiving the responses.
 * 
 * @class ApiService
 */
@Injectable()
export class ApiService {

  private API_ENDPOINT = "http://localhost:9696";

  constructor(private _logger: LoggerService) {}

  /** Writes a log as the ApiService. */
  private log(func: string, message: string, meta?: any) {
    this._logger.log("api.service", func, message, meta);
  }

  /**
   * Sends a request to the API server using the "post" HTTP method
   * and uses the provided callback function to return the response
   * to the request source.
   */
  postApi(
    endpoint: string, 
    body: string, 
    headers: AxiosHeaders | undefined, 
    callback: (n: ApiResponse) => void
  ) {
    // Ensure that the proper headers are set for an API request.
    if (!headers) headers = new AxiosHeaders();
    headers.set("Access-Control-Allow-Origin", this.API_ENDPOINT);
    headers.set("Content-Type", "application/json");
    // Send the request according to the parameters provided, and use
    // the callback function as the handler.
    axios.post(
      `${this.API_ENDPOINT}${endpoint}`,
      body,
      { headers: headers }
    )
      .then((axiosResponse: AxiosResponse) => {
        callback(<ApiResponse>axiosResponse.data);
      })
      .catch((axiosError: AxiosError) => {
        if (!axiosError.response) {
          return this.log(
            "postApi", 
            "Did not receive a proper response from the API",
            axiosError
          );
        }
        callback(<ApiResponse>axiosError.response.data);
      });
  }

  /**
   * Sends a request to the API server using the "get" HTTP method
   * and uses the provided callback function to return the response
   * to the request source.
   */
  getApi(
    endpoint: string, 
    headers: AxiosHeaders | undefined, 
    callback: (n: ApiResponse) => void
  ) {
    // Setup the required headers for an API request.
    if (!headers) headers = new AxiosHeaders();
    axios.get(
      `${this.API_ENDPOINT}${endpoint}`,
      { headers: headers }
    )
      .then((axiosResponse: AxiosResponse) => {
        callback(<ApiResponse>axiosResponse.data);
      })
      .catch((axiosError: AxiosError) => {
        if (!axiosError.response) {
          return this.log(
            "getApi",
            "Did not receive a proper response from the API",
            axiosError
          );
        }
        callback(<ApiResponse>axiosError.response.data);
      });
  }

  /** 
   * Requests a User from the API using the provided ID, and sends it
   * through the specified callback function.
   */
  getUserById(userId: number, callback: (n: User) => void) {
    this.getApi(`/users/id/${userId}`, undefined, (response: ApiResponse) => {
      callback(<User>response.data);
    });
  }

  /** 
   * Requests a User from the API using the provided username, and
   * sends it through the specified callback function.
   */
  getUserByUsername(username: string, callback: (n: User) => void) {
    this.getApi(`/users/username/${username}`, undefined, (response: ApiResponse) => {
      callback(<User>response.data);
    });
  }

  /** 
   * Requests a list of User objects using the provided validation
   * value and sends it through the specified callback function.
   */
  getUsersByValidationValue(value: string, callback: (n: User[]) => void) {
    this.getApi(`/users/validation/${value}`, undefined, (response: ApiResponse) => {
      callback(<User[]>response.data);
    });
  }

  /**
   * Requests a list of User objects with length `count` or less,
   * sorted by current course progress, and sends it through the
   * specified callback function.
   */
  getUsersByScore(count: number, callback: (n: User[]) => void) {
    this.getApi(`/leaderboard/${count}`, undefined, (response: ApiResponse) => {
      callback(<User[]>response.data);
    });
  }

  /**
   * Requests a list of User objects with length `count` or less,
   * sorted by position in the course content and filtered by
   * validation value, and sends it through the specified callback
   * function.
   */
  getClassUsersByScore(educationCode: string, count: number, callback: (n: User[]) => void) {
    this.getApi(`/leaderboard/class/${educationCode}/${count}`, undefined, (response: ApiResponse) => {
      callback(<User[]>response.data);
    });
  }

  /** 
   * Requests registration for a user with the provided information,
   * and returns the created user through the callback function.
   */
  registerUser(user: NewUser, callback: (n: User | undefined) => void) {
    this.log("registerUser", "registering user ...", user);
    this.postApi("/users/", JSON.stringify(user), undefined, (response: ApiResponse) => {
      if (response.data) {
        callback(<User>response.data);
      } else {
        this.log("registerUser", "failed to register", response);
        callback(undefined);
      }
    });
  }

  /** 
   * Requests an authorization token using the provided credentials and
   * returns it through the callback function.
   */
  getAuthToken(username: string, password: string, callback: (n: string) => void) {
    // Hash the password, as expected to be received by the API.
    password = CryptoJS.SHA512(password).toString(CryptoJS.enc.Hex);
    this.log("getAuthToken", `attempting to login as ${username} ...`);
    this.postApi(
      "/auth/login", 
      `{ "username": "${username}", "password": "${password}" }`, 
      undefined,
      (response: ApiResponse) => {
        callback(<string>response.data);
    });
  }

  /** 
   * Requests that the provided token be refreshed and returns the new
   * token through the callback function.
   */
  refreshAuthToken(currentToken: string, callback: (n: string) => void) {
    this.getApi(
      "/auth/refresh", 
      new AxiosHeaders({ "Authroization": `Bearer ${currentToken}` }), 
      (response: ApiResponse) => {
        callback(<string>response.data);
    });
  }

  /** 
   * Requests the CourseUnit for a provided CourseUnit ID, and returns
   * the result through the callback function.
   */
  getUnitById(unitId: number, callback: (n: CourseUnit) => void) {
    this.getApi(`/course/units/${unitId}`, undefined, (response: ApiResponse) => {
      callback(<CourseUnit>response.data);
    });
  }

  /** 
   * Requests the CourseLesson for a provided CourseLesson ID, and returns
   * the result through the callback function.
   */
  getLessonById(lessonId: number, callback: (n: CourseLesson) => void) {
    this.getApi(`/course/lessons/${lessonId}`, undefined, (response: ApiResponse) => {
      callback(<CourseLesson>response.data);
    });
  }

  /** 
   * Requests the CourseContent for a provided CourseContent ID, and returns
   * the result through the callback function.
   */
  getContentById(contentId: number, callback: (n: CourseContent) => void) {
    this.getApi(`/course/content/${contentId}`, undefined, (response: ApiResponse) => {
      callback(<CourseContent>response.data);
    });
  }

  /** 
   * Requests the CourseContent for a provided position within a
   * provided lesson identified by its CourseLesson ID, and returns
   * the result through the callback function.
   */
  getContentByPosition(lessonId: number, position: number, callback: (n: CourseContent) => void) {
    this.getApi(
      `/course/lessons/${lessonId}/content/${position}`, 
      undefined, 
      (response: ApiResponse) => {
        callback(<CourseContent>response.data);
    });
  }

  /** 
   * Requests a list of CourseContent for a provided lesson identified
   * by its CourseLesson ID, and returns the result through the
   * callback function.
   */
  getContentByLesson(lessonId: number, callback: (n: CourseContent[]) => void) {
    this.getApi(
      `/course/lessons/${lessonId}/content/`, 
      undefined, 
      (response: ApiResponse) => {
        callback(<CourseContent[]>response.data);
    });
  }

  /** 
   * Requests the data required to calculate the scores for a list of
   * Users and feeds them through the callback as they are calculated.
   */
  getUserScores(users: User[], callback: (n: LeaderboardEntry) => void ) {
    this.log("getUserScores", "retrieving scores for users", users);
    users.forEach((user, index) => {
      this.getLessonById(user.progress_lesson + 1, (lesson) => {
        this.getUnitById(lesson.unit_id, (unit) => {
          this.getContentById(user.progress_content + 1, (content) => {
            const percent = this.calculateProgress(
              lesson.position, unit.lesson_count, 
              content.position, lesson.content_count
            );
            callback({
              username: user.username,
              percent: percent,
              score: Math.floor(percent * 10000)
            });
          });
        });
      });
    });
  }

  /** Helper function for calculating a user's current progress. */
  calculateProgress(
    lesson: number, totalLessons: number, 
    content: number, totalContent: number
  ) {
    const lessonProgress = (lesson - 1) / totalLessons;
    const singleLesson = 1 / totalLessons;
    const contentProgress = (content - 1) / totalContent;
    return lessonProgress + (contentProgress * singleLesson);
  }

}
