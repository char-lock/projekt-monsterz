import { Directive, ViewContainerRef } from "@angular/core";

/** 
 * A directive used to indicate where a modal's content can be inserted.
 * 
 * @class FangModalContentDirective
 */
@Directive({
  selector: "[fang-modal-content]"
})
export class FangModalContentDirective {

  constructor(public viewContainerRef: ViewContainerRef) {}

}
