import { IMonsterInfoDigest, IMonsterPalette, IMonsterPart } from "../monsters/monsters.models";
import { IUser, VerificationMethod, UserRole } from "../users/users.models";

export default class DummyDb {
  private static monsterData: IMonsterInfoDigest[] = [];
  private static partData: IMonsterPart[] = [
    {id: 11, slot: 1, imageData: '', palette: { id: 1, colours: ['', '', '', '', '', '', ''] }},
    {id: 21, slot: 2, imageData: '', palette: { id: 1, colours: ['', '', '', '', '', '', ''] }},
    {id: 31, slot: 3, imageData: '', palette: { id: 1, colours: ['', '', '', '', '', '', ''] }},
    {id: 41, slot: 4, imageData: '', palette: { id: 1, colours: ['', '', '', '', '', '', ''] }},
    {id: 51, slot: 5, imageData: '', palette: { id: 1, colours: ['', '', '', '', '', '', ''] }},
    {id: 61, slot: 6, imageData: '', palette: { id: 1, colours: ['', '', '', '', '', '', ''] }},
    {id: 71, slot: 7, imageData: '', palette: { id: 1, colours: ['', '', '', '', '', '', ''] }},
    {id: 81, slot: 8, imageData: '', palette: { id: 1, colours: ['', '', '', '', '', '', ''] }},
    {id: 91, slot: 9, imageData: '', palette: { id: 1, colours: ['', '', '', '', '', '', ''] }}
  ];
  private static userData: IUser[] = [
    {
      id: '475932369720dc89afa0ab176ae0dcf2b986fff7749bc445d8b488691c046cb8',
      username: 'testUser',
      authKey: 'WrhpA+5Z83z7nQsooSTAaw==$uL90RNciIV5dlHViq7NRe62prv0kkB7vGQP71v0E6LUZ1cu8B8G742uvIcZ/TV42nhx5Mv1elyMgJRaUBACGhg==',
      role: UserRole.INDIVIDUAL,
      verification: {
        method: VerificationMethod.EMAIL,
        value: 'test.user@gmail.com',
        verified: false
      }
    }
  ];
  private static paletteData: IMonsterPalette[] = [
    { id: 1, colours: ['', '', '', '', '', '', ''] }
  ];
  
  static saveMonsterDigest(monster: IMonsterInfoDigest) {
    DummyDb.monsterData.push(monster);
    return true;
  }

  static loadMonsterDigest(monsterId: string) {
    return this.monsterData.filter((value) => { return value.hash === monsterId; });
  }

  static loadMonsterPart(partId: number) {
    return this.partData.filter((value) => { return value.id === partId; });
  }

  static loadPalette(paletteId: number) {
    return this.paletteData.filter((value) => { return value.id === paletteId; });
  }

  static loadUserById(userId: string) {
    return this.userData.filter((value) => { return value.id === userId; });
  }

  static loadUserByUsername(username: string) {
    return this.userData.filter((value) => { return value.username === username; });
  }

  static loadUserByEmail(userEmail: string) {
    return this.userData.filter((value) => { return value.verification.method === VerificationMethod.EMAIL && value.verification.value === userEmail; });
  }

  static loadUsersByEducatorCode(educatorCode: string) {
    return this.userData.filter((value) => { return value.verification.method === VerificationMethod.EDUCATOR_CODE && value.verification.value === educatorCode; });
  }

  static saveUser(userData: IUser) {
    DummyDb.userData.push(userData);
  };

}