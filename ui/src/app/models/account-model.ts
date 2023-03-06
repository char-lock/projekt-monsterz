
export class Account {
     constructor(private id: string, private username: string, private authKey: string, private role: number, private verify: {verified: boolean, method: number, value: string}){
     }
     editVerify(verified: boolean, method: number, value: string) {
          this.verify.verified = verified;
          this.verify.method = method;
          this.verify.value = value;
     }
     addUsernameAndPasswordAndRole(username: string, password: string, role: number) {
          this.username = username;
          this.authKey = password;
          this.role = role;
     }
     
}