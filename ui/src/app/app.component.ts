import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {  
  title ='projekt-monsterz-front'
  loginClick = false;
  formChosen = '';
  clickOutside() {
    if (this.loginClick == true) {
      this.formChosen = '';
    }
  }
  changeContent(definer: string) {
    // console.log("Change Content Called!")
    if (definer !== '') {
      this.loginClick = !this.loginClick;
      this.formChosen = definer;
    } 
    else {
      this.loginClick = false;
    }
   }
  setStyle() {
    // console.log("Set Style Called!")
    if (this.loginClick == false) {
      return {'filter' : 'blur(0px)'};
    }
    return {'filter' : 'blur(2px)'};

  }
  seeTarget($event: any) {
    console.log("Clicked outside of login! Exiting...")
    if ($event.target.closest('#app-login') == null) {
      this.changeContent('');
    }    
  }
}
