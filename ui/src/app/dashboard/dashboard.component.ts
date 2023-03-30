import { AccountService } from '../services/account-service.service';
import { Component, ElementRef, OnInit} from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  globalLeaderBoardSelected = false;
  globalLeaderBoard = [
    ["Earl", 200],
    ["PanPeter", 500],
    ["Grimjow", 5000],
    ["Dumbo", 6000]
  ];
   friendsOrClassLeaderBoard = [
    ["Joe", 200],
    ["Bojack", 500],
    ["PixieTawk", 5000],
    ["Sleepy", 6000]
   ];
  username: string = 'Poop Head';
  progress: number = 15;
  score: number = 200;
  CurrentLesson: string = "Lesson 1-8";
  constructor(private accountService: AccountService){}
  ngOnInit() {
    this.accountService.currentAccountObserve.subscribe((value) => {
    });  
  }
  leaderBoard: (string | number)[][] = this.friendsOrClassLeaderBoard;

    
    setProgressBar() {
      let styles = {
        // 'background': 'linear-gradient(90deg, green 15%, black 85%)',
        'background': 
        'linear-gradient(90deg, #4dd700 ' + 0 + '% ' + (this.progress) + '%, #86a9b0 ' + (this.progress) + '% 100%)'        
      }
        return styles;
    }
    onToggleButtonClick() {
      this.globalLeaderBoardSelected = !this.globalLeaderBoardSelected;
      if (this.globalLeaderBoardSelected) {
        this.leaderBoard = this.globalLeaderBoard;
      }
      else {
      this.leaderBoard = this.friendsOrClassLeaderBoard;
      }
    }
  }
