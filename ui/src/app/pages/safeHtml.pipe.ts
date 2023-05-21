import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({ 
  name: "safeHtml",
  pure: false
})
export class SafeHtmlPipe implements PipeTransform {
  
  constructor(
    private _sanitizer: DomSanitizer
  ) {}

  /** Transforms the provided input without sanitizing HTML data. */
  public transform(content: string) {
    return this._sanitizer.bypassSecurityTrustHtml(content);
  }

}