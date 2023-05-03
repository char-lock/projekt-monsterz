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

  /**
   * Writes a log to the console from the API service.
   * 
   * @param func Name of the function from which the log originates
   * 
   * @param message Content of the log
   * 
   * @param meta (Optional) Any additional information or object to
   * include with the log.
   */
  private log(func: string, message: string, meta?: any) {
    this._logger.log("api.service", func, message, meta);
  }

  /**
   * Sends a request to the API server using the "post" HTTP method
   * and uses the provided callback function to return the response
   * to the request source.
   * 
   * @param endpoint Target endpoint of the API to which to post
   * 
   * @param body JSON-formatted data to post
   * 
   * @param headers An AxiosHeaders object with desired headers
   * 
   * @param callback Function with which to process the response
   */
  private _postApi(
    endpoint: string, 
    body: string, 
    headers: AxiosHeaders | undefined, 
    callback: (n: ApiResponse) => void
  ): void {
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
   * 
   * @param endpoint Target endpoint of the API from which to get
   * 
   * @param headers An AxiosHeaders object with desired headers
   * 
   * @param callback Function with which to process the response
   */
  private _getApi(
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
   * 
   * @param userId Primary key for the desired User
   * 
   * @param callback Function with which to handle the response
   */
  public getUserById(userId: number, callback: (n: User) => void) {
    this._getApi(
      `/users/id/${userId}`, 
      undefined, 
      (response: ApiResponse) => {
        callback(<User>response.data);
      }
    );
  }

  /** 
   * Requests a User from the API using the provided username, and
   * sends it through the specified callback function.
   * 
   * @param username Username of the desired User
   * 
   * @param callback Function with which to handle the response
   */
  public getUserByUsername(
    username: string, 
    callback: (n: User) => void
  ) {
    this._getApi(
      `/users/username/${username}`, 
      undefined, 
      (response: ApiResponse) => {
        callback(<User>response.data);
      }
    );
  }

  /** 
   * Requests a list of User objects using the provided validation
   * value and sends it through the specified callback function.
   * 
   * @param value Validation value for which to search
   * 
   * @param callback Function with which to handle the response
   */
  public getUsersByValidationValue(
    value: string, 
    callback: (n: User[]) => void
  ) {
    this._getApi(
      `/users/validation/${value}`, 
      undefined, 
      (response: ApiResponse) => {
        callback(<User[]>response.data);
      }
    );
  }

  /**
   * Requests a list of User objects with length `count` or less,
   * sorted by current course progress, and sends it through the
   * specified callback function.
   * 
   * @param count Desired count of users to receive
   * 
   * @param callback Function with which to handle the response
   */
  public getUsersByScore(
    count: number, 
    callback: (n: User[]) => void
  ) {
    this._getApi(
      `/leaderboard/${count}`, 
      undefined, 
      (response: ApiResponse) => {
        callback(<User[]>response.data);
      }
    );
  }

  /**
   * Requests a list of User objects with length `count` or less,
   * sorted by position in the course content and filtered by
   * validation value, and sends it through the specified callback
   * function.
   * 
   * @param educationCode Education code with which to filter Users
   * 
   * @param count Desired count of users to receive
   * 
   * @param callback Function with which to handle the response
   */
  public getClassUsersByScore(
    educationCode: string, 
    count: number, 
    callback: (n: User[]) => void
  ) {
    this._getApi(
      `/leaderboard/class/${educationCode}/${count}`, 
      undefined, 
      (response: ApiResponse) => {
        callback(<User[]>response.data);
      }
    );
  }

  /** 
   * Requests registration for a user with the provided information,
   * and returns the created user through the callback function.
   * 
   * @param user Data for the new user to register
   * 
   * @param callback Function with which to handle the response
   */
  public registerUser(
    user: NewUser, 
    callback: (n: User | undefined) => void
  ) {
    this.log("registerUser", "registering user ...", user);
    this._postApi(
      "/users/", 
      JSON.stringify(user), 
      undefined, 
      (response: ApiResponse) => {
        if (response.data) {
          callback(<User>response.data);
        } else {
          this.log("registerUser", "failed to register", response);
          callback(undefined);
        }
      }
    );
  }

  /** 
   * Requests an authorization token using the provided credentials and
   * returns it through the callback function.
   * 
   * @param username Username for the user
   * 
   * @param password Plaintext password for the user
   * 
   * @param callback Function with which to handle the response
   */
  public getAuthToken(
    username: string, 
    password: string, 
    callback: (n: string) => void
  ) {
    // Hash the password, as expected to be received by the API.
    password = CryptoJS.SHA512(password).toString(CryptoJS.enc.Hex);
    this.log("getAuthToken", `attempting to login as ${username} ...`);
    this._postApi(
      "/auth/login", 
      `{ "username": "${username}", "password": "${password}" }`, 
      undefined,
      (response: ApiResponse) => {
        callback(<string>response.data);
      }
    );
  }

  /** 
   * Requests that the provided token be refreshed and returns the new
   * token through the callback function.
   * 
   * @param currentToken Token with which the current session is authenticated
   * 
   * @param callback Function with which to handle the response
   */
  public refreshAuthToken(
    currentToken: string, 
    callback: (n: string) => void
  ) {
    this._getApi(
      "/auth/refresh", 
      new AxiosHeaders({ 
        "Authorization": `Bearer ${currentToken}` 
      }), 
      (response: ApiResponse) => {
        callback(<string>response.data);
      }
    );
  }

  /** 
   * Requests the CourseUnit for a provided CourseUnit ID, and returns
   * the result through the callback function.
   * 
   * @param unitId Primary key for the desired CourseUnit
   * 
   * @param callback Function with which to handle the response
   */
  public getUnitById(
    unitId: number, 
    callback: (n: CourseUnit) => void
  ) {
    this._getApi(
      `/course/units/${unitId}`, 
      undefined, 
      (response: ApiResponse) => {
        callback(<CourseUnit>response.data);
      }
    );
  }

  /** 
   * Requests the CourseLesson for a provided CourseLesson ID, and returns
   * the result through the callback function.
   * 
   * @param lessonId Primary key for the desired CourseLesson
   * 
   * @param callback Function with which to handle the response
   */
  public getLessonById(
    lessonId: number, 
    callback: (n: CourseLesson) => void
  ) {
    this._getApi(
      `/course/lessons/${lessonId}`, 
      undefined, 
      (response: ApiResponse) => {
        callback(<CourseLesson>response.data);
      }
    );
  }

  /**
   * Requests the CourseLesson for a provided lesson position within a
   * CourseUnit, and returns the result through the callback function.
   * 
   * @param unitId Primary key for the CourseUnit containing the lesson
   * 
   * @param lessonPosition Position within the unit for the lesson
   * 
   * @param callback Function with which to handle the response
   */
  getLessonByPosition(
    unitId: number, 
    lessonPosition: number, 
    callback: (n: CourseLesson) => void
  ) {
    this._getApi(
      `/course/units/${unitId}/lessons/${lessonPosition}`, 
      undefined, 
      (response: ApiResponse) => {
        callback(<CourseLesson>response.data);
      }
    );
  }

  /** 
   * Requests the CourseContent for a provided CourseContent ID, and returns
   * the result through the callback function.
   * 
   * @param contentId Primary key for the desired CourseContent
   * 
   * @param callback Function with which to handle the response
   */
  public getContentById(contentId: number, callback: (n: CourseContent) => void) {
    this._getApi(
      `/course/content/${contentId}`, 
      undefined, 
      (response: ApiResponse) => {
        callback(<CourseContent>response.data);
      }
    );
  }

  /** 
   * Requests the CourseContent for a provided position within a
   * provided lesson identified by its CourseLesson ID, and returns
   * the result through the callback function.
   * 
   * @param lessonId Primary key for the containing CourseLesson
   * 
   * @param position Position for the content within the CourseLesson
   * 
   * @param callback Function with which to handle the response
   */
  public getContentByPosition(
    lessonId: number, 
    position: number, 
    callback: (n: CourseContent) => void
  ) {
    this._getApi(
      `/course/lessons/${lessonId}/content/${position}`, 
      undefined, 
      (response: ApiResponse) => {
        callback(<CourseContent>response.data);
      }
    );
  }

  /** 
   * Requests a list of CourseContent for a provided lesson identified
   * by its CourseLesson ID, and returns the result through the
   * callback function.
   * 
   * @param lessonId Primary key for the desired CourseContent
   * 
   * @param callback Function with which to handle the response
   */
  public getContentByLesson(
    lessonId: number, 
    callback: (n: CourseContent[]) => void
  ) {
    this._getApi(
      `/course/lessons/${lessonId}/content/`, 
      undefined, 
      (response: ApiResponse) => {
        callback(<CourseContent[]>response.data);
      }
    );
  }

  /** 
   * Requests the data required to calculate the scores for a list of
   * Users and feeds them through the callback as they are calculated.
   * 
   * @param users List of users for which to get the score
   * 
   * @param callback Function with which to handle results one-by-one
   */
  public getUserScores(
    users: User[], 
    callback: (n: LeaderboardEntry) => void 
  ) {
    this.log("getUserScores", "retrieving scores for users", users);
    users.forEach((user) => {
      this.getLessonById(user.progress_lesson + 1, (lesson) => {
        this.getUnitById(lesson.unit_id, (unit) => {
          this.getContentById(
            user.progress_content + 1, 
            (content) => {
              const percent = this._calculateProgress(
                lesson.position, 
                unit.lesson_count, 
                content.position, 
                lesson.content_count
              );
              callback({
                username: user.username,
                percent: percent,
                score: Math.floor(percent * 10000)
              });
            }
          );
        });
      });
    });
  }

  /** 
   * Returns a value between 0 and 1 representing the current unit
   * progress based on the provided values.
   * 
   * @param lesson Position of the lesson within the unit
   * 
   * @param totalLessons Count of total lessons in the unit
   * 
   * @param content Position of the content within the lesson
   * 
   * @param totalContent Count of total content in the lesson
   */
  private _calculateProgress(
    lesson: number, 
    totalLessons: number, 
    content: number, 
    totalContent: number
  ) {
    const lessonProgress = (lesson - 1) / totalLessons;
    const singleLesson = 1 / totalLessons;
    const contentProgress = (content - 1) / totalContent;
    return lessonProgress + (contentProgress * singleLesson);
  }

}
