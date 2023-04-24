import { Injectable } from "@angular/core";

import axios from "axios";
import { AxiosHeaders } from "axios";

import { ApiResponse } from "../types/ApiResponse";
import { User } from "../types/User";
import { LessonContent } from "../types/Content";

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
  GetOneLessonContent() {
    let lesson: LessonContent =  {
      contentType: 0,
      contentText: "What is your name?",
      correctAnswer: "10",
      genericAnswers: ["10", "20", "30", "40"]
    }
    return lesson;
  }
  GetWholeLessonContent() {

    let lessonArray: LessonContent[] = [
      {
        contentType: 1,
        contentText: "What is your name?",
        correctAnswer: "Jesse",
        genericAnswers: ["Jesse", "Jeff Buckley", "Tobie McGuire", "40"]
      },
      {
      contentType: 1,
      contentText: "What is your Hometown?",
      correctAnswer: "Leaf Village",
      genericAnswers: ["Fishtown", "Leaf Village", "Summerville", "No Man's Land"]
      },
      {
      contentType: 1,
      contentText: "What is your Age?",
      correctAnswer: "10",
      genericAnswers: ["10", "20", "30", "40"]
      },
      {
        contentType: 1,
        contentText: "What is your Age?",
        correctAnswer: "10",
        genericAnswers: ["10", "20", "30", "40"]
      },
      {
        contentType: 2,
        contentText: "What is your Age?",
        correctAnswer: "10",
        genericAnswers: ["10", "20", "30", "40"]
      },
      {
        contentType: 1,
        contentText: "What is your Age?",
        correctAnswer: "10",
        genericAnswers: ["10", "20", "30", "40"]
      },
      {
        contentType: 3,
        contentText: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Risus commodo viverra maecenas accumsan lacus vel facilisis. Amet volutpat consequat mauris nunc congue nisi vitae suscipit tellus. Sem nulla pharetra diam sit amet nisl suscipit adipiscing bibendum. Ipsum a arcu cursus vitae congue mauris. Semper quis lectus nulla at. Consectetur lorem donec massa sapien faucibus et molestie. Lobortis mattis aliquam faucibus purus in massa tempor. Diam maecenas ultricies mi eget. Dignissim sodales ut eu sem integer vitae justo. Morbi quis commodo odio aenean sed. Sit amet tellus cras adipiscing enim eu turpis egestas pretium. Tellus integer feugiat scelerisque varius morbi enim nunc. Risus nullam eget felis eget nunc lobortis. Massa tincidunt dui ut ornare lectus sit amet est.

        Viverra ipsum nunc aliquet bibendum enim facilisis. Amet mattis vulputate enim nulla. Odio ut enim blandit volutpat maecenas volutpat. Rhoncus aenean vel elit scelerisque mauris pellentesque. Mauris pellentesque pulvinar pellentesque habitant morbi tristique. Integer quis auctor elit sed. Feugiat pretium nibh ipsum consequat nisl. Leo urna molestie at elementum eu. Facilisi etiam dignissim diam quis enim. Cum sociis natoque penatibus et magnis dis. In aliquam sem fringilla ut morbi tincidunt augue.
        
        Urna cursus eget nunc scelerisque. Congue mauris rhoncus aenean vel elit scelerisque mauris. Massa tempor nec feugiat nisl pretium fusce id velit. Pharetra diam sit amet nisl suscipit adipiscing bibendum est. Nunc mi ipsum faucibus vitae aliquet nec ullamcorper sit. Placerat vestibulum lectus mauris ultrices. Cras ornare arcu dui vivamus arcu felis. Lacus viverra vitae congue eu consequat ac felis donec. Placerat duis ultricies lacus sed turpis tincidunt id aliquet risus. Vel orci porta non pulvinar. Nam aliquam sem et tortor consequat id porta. Diam phasellus vestibulum lorem sed. Convallis posuere morbi leo urna molestie at elementum. Id volutpat lacus laoreet non curabitur gravida arcu ac tortor. Ultricies lacus sed turpis tincidunt id aliquet. Ullamcorper velit sed ullamcorper morbi tincidunt ornare. Accumsan lacus vel facilisis volutpat est velit egestas. Feugiat sed lectus vestibulum mattis ullamcorper. Nisi porta lorem mollis aliquam ut porttitor leo a diam.
        
        Nunc eget lorem dolor sed. Malesuada fames ac turpis egestas sed tempus urna et. Tortor id aliquet lectus proin nibh nisl condimentum id. Ac tincidunt vitae semper quis lectus. Adipiscing elit duis tristique sollicitudin nibh sit. Sit amet luctus venenatis lectus magna fringilla urna porttitor. Cursus turpis massa tincidunt dui ut. Risus at ultrices mi tempus imperdiet. Iaculis eu non diam phasellus vestibulum. Tristique senectus et netus et malesuada fames ac turpis egestas. Urna cursus eget nunc scelerisque viverra mauris in aliquam sem. Pharetra sit amet aliquam id diam. Pellentesque massa placerat duis ultricies lacus sed turpis tincidunt id. Curabitur vitae nunc sed velit dignissim sodales ut eu. Eu sem integer vitae justo eget. Blandit libero volutpat sed cras ornare arcu dui. Id faucibus nisl tincidunt eget nullam non. Penatibus et magnis dis parturient montes nascetur ridiculus.
        
        Ut consequat semper viverra nam libero justo laoreet sit amet. Eu consequat ac felis donec et. Hac habitasse platea dictumst vestibulum rhoncus est pellentesque elit. Vulputate eu scelerisque felis imperdiet proin fermentum. Viverra vitae congue eu consequat ac. In vitae turpis massa sed elementum. Id faucibus nisl tincidunt eget nullam non nisi est. Imperdiet sed euismod nisi porta lorem mollis. A pellentesque sit amet porttitor eget dolor morbi. Vel pharetra vel turpis nunc eget lorem dolor sed. Tellus id interdum velit laoreet id donec. Non sodales neque sodales ut etiam sit. Viverra suspendisse potenti nullam ac tortor vitae purus. Vitae aliquet nec ullamcorper sit amet.`
      },
      {
        contentType: 1,
        contentText: "What is your Age?",
        correctAnswer: "10",
        genericAnswers: ["10", "20", "30", "40"]
      },
      {
        contentType: 4,
        contentText: "What is your Age?",
        correctAnswer: "10",
      },

    ]
    return lessonArray;
  }

}
