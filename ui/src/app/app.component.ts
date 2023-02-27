import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {  
  title ='projekt-monsterz-front'
  loginClick = false;
  clickedOutsideVar = false;
  formChosen = '';
  clickOutside($event: any) {
    if ($event.target.closest('app-login-screen') == null && this.loginClick == true && $event.srcElement && $event.srcElement.classList.contains('openmenu') == false) {
      this.changeContent('')
    }
 }
  changeContent(definer: string) {
    // console.log("Change Content Called!")
    console.log("Changing content Called!")
    if (definer == 'close') {
      this.loginClick = false;
    }
    else if (definer !== '') {
      this.loginClick = !this.loginClick;
      this.formChosen = definer;
    } 
    else {

      this.loginClick = !this.loginClick;
    }
   }
  setStyle() {
    // console.log("Set Style Called!")
    if (this.loginClick == false) {
      return {'filter' : 'blur(0px)'};
    }
    return {'filter' : 'blur(2px)'};

  }
  
}
