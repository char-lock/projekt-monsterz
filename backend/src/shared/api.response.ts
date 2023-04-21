import { Response } from "express";

const HttpResponseCode: { [key: string]: string } = {
  "100": "Continue",
  "101": "Switching Protocols",
  "200": "OK",
  "201": "Created",
  "202": "Accepted",
  "400": "Bad Request",
  "401": "Unauthorised",
  "403": "Forbidden",
  "404": "Not Found",
  "408": "Request Timeout",
  "500": "Internal Server Failure",
  "501": "Not Implemented",
  "502": "Bad Gateway",
  "503": "Service Unavailable"
};

/** A representation of the standard API response. */
export class ApiResponse {

  private response: Response;
  private responseCode: number;
  private responseShortDesc: string;
  private responseLongDesc: string;

  constructor(res: Response) {
    this.response = res;
    this.responseCode = 200;
    this.responseShortDesc = "OK";
    this.responseLongDesc = "";
  }

  /** Set the response status for the API response. */
  status(statusCode: number) {
    if (!Object.keys(HttpResponseCode).includes(statusCode.toString()))
      throw("error: unknown response code");
    this.responseCode = statusCode;
    this.responseShortDesc = HttpResponseCode[statusCode.toString()];
  }

  /** Set the description for the API response. */
  describe(description: string) {
    this.responseLongDesc = description;
  }

  /** Sends the API response to the route. */
  send(data?: any) {
    this.response.status(this.responseCode).json({
      statusCode: this.responseCode,
      statusShortDesc: this.responseShortDesc,
      statusLongDesc: this.responseLongDesc,
      data: data
    });
  }

}
