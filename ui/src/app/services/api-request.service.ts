import { Injectable} from "@angular/core";


@Injectable()
export class MakeApiRequest {
  makeApiRequest() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
var raw = JSON.stringify({
  "id": "",
  "username": "testUser",
  "authKey": "testPass",
  "role": 1,
  "verification": {
    "verified": false,
    "method": 1,
    "value": "test.user@gmail.com"
  }
});
var requestOptions: RequestInit = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};
fetch("http://localhost:8080/users/register", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('Error: ', error));

}
    
}
    
    

