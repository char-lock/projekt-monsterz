
export class Account {
     constructor(public id: string, public username: string, public authKey: string, public role: number, public verify: {verified: boolean, method: number, value: string}){
     }
}