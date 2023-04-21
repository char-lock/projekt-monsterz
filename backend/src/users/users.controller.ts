import { Request, Response } from "express";
import { ApiResponse } from "../shared/api.response";

/** Handles the logic for any routing requests on the "/users/" endpoint. */
class UsersController {

  static getUserById(req: Request, rawRes: Response) {
    const res = new ApiResponse(rawRes);

    res.send();
  }

}

export default UsersController;
