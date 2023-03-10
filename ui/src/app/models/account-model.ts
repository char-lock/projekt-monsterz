
export class Account {
     constructor(public id: string, public username: string, public authKey: string, public role: number, public verification: {verified: boolean, method: number, value: string}){
     }
}