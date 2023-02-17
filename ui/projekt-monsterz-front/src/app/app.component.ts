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
  changeContent(definer: string) {
    console.log("Change Content Called!")
    this.formChosen = definer;
    this.loginClick = !this.loginClick;
  }
  setStyle() {
    if (this.loginClick == false) {
      return {'filter' : 'blur(0px)'};
    }
    return {'filter' : 'blur(2px)'};

  }
}
