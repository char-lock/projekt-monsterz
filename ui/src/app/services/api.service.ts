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

@Injectable()
export class ApiService {

  static API_ENDPOINT = "http://localhost:9696";

  constructor(private _logger: LoggerService) { }

  /** Writes a log using the logger service and specifying the source. */
  log(func: string, message: string, meta?: any) {
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
    headers.set("Access-Control-Allow-Origin", ApiService.API_ENDPOINT);
    headers.set("Content-Type", "application/json");
    // Send the request according to the parameters provided, and use
    // the callback function as the handler.
    axios.post(
      `${ApiService.API_ENDPOINT}${endpoint}`,
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
  deleteApi(
    endpoint: string,
    body: string,
    headers: AxiosHeaders | undefined,
    callback: (n: ApiResponse) => void
  ) {
    // Ensure that the proper headers are set for an API request.
    if (!headers) headers = new AxiosHeaders();
    headers.set("Access-Control-Allow-Origin", ApiService.API_ENDPOINT);
    headers.set("Content-Type", "application/json");
    // Send the request according to the parameters provided, and use
    // the callback function as the handler.
    axios.delete(
      `${ApiService.API_ENDPOINT}${endpoint}`,
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
      `${ApiService.API_ENDPOINT}${endpoint}`,
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
  registerUser(user: NewUser, callback: (n: User) => void) {
    this.log("registerUser", "registering user ...", user);
    this.postApi("/users/", JSON.stringify(user), undefined, (response: ApiResponse) => {
      if (response.data) {
        callback(<User>response.data);
      } else {
        this.log("registerUser", "failed to register", response);
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

  getUserScores(users: User[], currentUserName: string, callback: (n: LeaderboardEntry) => void) {
    this.log("getUserScores", "retrieving scores for users", users);
    users.forEach((user, index) => {
      this.getLessonById(user.progress_lesson + 1, (lesson) => {
        this.getUnitById(lesson.unit_id, (unit) => {
          this.getContentById(user.progress_content + 1, (content) => {
            const percent = this.calculateProgress(
              lesson.position, unit.lesson_count,
              content.position, lesson.content_count
            );
            callback(
              {
                username: user.username == currentUserName ? 'YOU' : user.username,
                percent: percent,
                score: Math.floor(percent * 10000),
              });
          });
        });
      });
    });
  }

  calculateProgress(
    lesson: number, totalLessons: number,
    content: number, totalContent: number
  ) {
    const lessonProgress = (lesson - 1) / totalLessons;
    const singleLesson = 1 / totalLessons;
    const contentProgress = (content - 1) / totalContent;
    return lessonProgress + (contentProgress * singleLesson);
  }
  /** 
   * @function Requests that the current user's progress be updated.
   * @returns the contentProgress and contentLength (resp.) 
   * to update the userService through the callback function.
   * 
   * @param username or the currently logged in user's name, this will be used to locate the correct user in the backend.
   * @param contentProgress or the current course content the user is on.
   * @param contentLength or the current length of course content, used to gauge the remaining questions and update course lesson if necessary.
   * @param callback Function with which to handle the response, returns an array of contentProgress and contentLength (resp.).
   */
  postProgressByUsername(username: string,
    contentProgress: number,
    contentLength: number,
    callback: (n: Array<number>) => void) {
    this.log("updateScoreByUsername", username);
    this.postApi(`/users/username/${username}/progress`,
      `{"contentProgress": "${contentProgress}", "contentLength": "${contentLength}"}`,
      undefined,
      (response: ApiResponse) => {
        if (response.data) {
          callback(response.data);
          //Returns content and lesson number!
        } else {
          this.log("updateScoreByUsername", "failed to update score", response);
        }
      });
  }

  /** 
 * @function For instuctor users to delete unnecessary content.
 * 
 */
  deleteLessonByContentId(contentId: number,
    lessonId: number,
    callback: (n: Array<number>) => void) {
    this.log("deleteCourseContentById", contentId.toString());
    this.deleteApi(`course/content/${contentId}/removal`,
      `{"lessonId": "${lessonId}"}`,
      undefined,
      (response: ApiResponse) => {
        console.log(response);
        if (response.data) {
          callback(response.data);
        } else {
          this.log("updateScoreByUsername", "failed to update score", response);
        }
      });
  }
  postContentProgress(contentId: number,
    callback: (n: number) => void) {
    this.log("postContentProgress", contentId.toString());
    this.postApi(`/content/${contentId}/completion`, 
    `{"contentId": "${contentId}"}`,
    undefined,
      (response: ApiResponse) => {
      if (response.data) {
        callback(response.data);
        //Returns content and lesson number!
      } else {
        this.log("updateScoreByUsername", "failed to update score", response);
      }
     });
  }

}
