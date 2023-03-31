import { Directive, ElementRef } from "@angular/core";


@Directive ({
     selector: '[cageBackground]'
})
export class MonsterCageBackgroundDirective {
  
  relativePath: string ="../../assets/backgrounds/"
  href: Array<string> = [
    'greatwallofchina.jpg',
    'leaningtowerofpisa.jpg',
    'sharkbackground.jpg',
    'vecteezy_beautiful-green-hills-with-big-tree-and-mountains-row-on-the_5949107.jpg'
  ]
  
  constructor(private element: ElementRef) {
    this.element.nativeElement.style.background = "url(" +
    this.relativePath + this.href[this.getBackground()] + ")";
    console.log(this.relativePath + this.href[this.getBackground()]);
  }
  
  getBackground(): number {
    return Math.floor(Math.random() * (this.href.length - 1))
  }

}
