export class DashBoardModuleModel {
  title: string;
  optionalAssetURI: string;
  content: string;
  constructor(title: string, optionalAssetUri: string, content: string) {
    this.title = title;
    this.optionalAssetURI = optionalAssetUri;
    this.content = content;
  }
}
