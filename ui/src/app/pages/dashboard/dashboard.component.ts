import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { LeaderboardService } from 'src/app/services/leaderboard.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  globalLeaderboardSelected = true;

  progress: number = 0;
  score: number = 0;
  currentLesson: string = "Lesson 1-8";

  constructor(
    private _api: ApiService,
    private leaderboardService: LeaderboardService,
    private _session: SessionService
  ) {}

  ngOnInit() {
    this._session.userSubject.subscribe((change) => {
      if (change) {
        this._api.getUserScores([change], (score) => {
          this.score = score.score;
          this.progress = score.percent;
          this.DrawProgressBar();
        });
        this.getLessonLabel();
      }
    });
  }

  getLessonLabel() {
    if (this._session.user) {
      this._api.getLessonById(this._session.user.progress_lesson + 1, (lesson) => {
        this.currentLesson = `Lesson ${lesson.unit_id}-${lesson.position}`;
      });
    }
  }

  DrawProgressBar() {
    const canvasElement: HTMLElement | null = document.getElementById("progressArc");
    const canvas: HTMLCanvasElement = canvasElement as HTMLCanvasElement;
    if (canvas === null) return;
    const ctx = canvas.getContext("2d");
    if (ctx === null) return;
    let progressAngle = (this.progress * 360.00);
    progressAngle += 180;
    if (progressAngle > 360) progressAngle -= 360;
    if (progressAngle < 0) progressAngle += 360;
    progressAngle *= Math.PI / 180;

    const arcX = canvas.width / 2;
    const arcY = canvas.height / 2;
    const radius = arcX / 2;

    const startAngleBg = 180 * Math.PI / 180;
    const endAngleBg = 0 * Math.PI / 180;

    const counterClockwise = false;

    ctx.beginPath();
    ctx.lineWidth = 32;
    ctx.strokeStyle = "rgb(175, 175, 175)";
    ctx.arc(arcX, arcY, radius, startAngleBg, endAngleBg, counterClockwise);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 32;
    ctx.strokeStyle = "rgb(50, 180, 50)";
    ctx.arc(arcX, arcY, radius, startAngleBg, progressAngle, counterClockwise);
    ctx.stroke();
  }

  setProgressBar() {
    let styles = {
      // 'background': 'linear-gradient(90deg, green 15%, black 85%)',
      'background':
        'linear-gradient(95deg, #4dd700 ' + 0 + '% ' + (this.progress) + '%, #86a9b0 ' + (this.progress) + '% 100%)'
    }
    return styles;
  }

  onToggleButtonClick() {
    this.globalLeaderboardSelected = !this.globalLeaderboardSelected;
  }

  getLeaderboard() {
    return this.leaderboardService.leaderboard(
      this.globalLeaderboardSelected
    );
  }

}
