import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  likesCount: number = 0;
  incidentsCount: number = 0;
  dislikesCount: number = 0;

  constructor() { }

  ngOnInit() {
  }

  updateStats() {
    const totalResponses = this.likesCount + this.dislikesCount;
    const likesPercentage = totalResponses > 0 ? ((this.likesCount / totalResponses) * 100).toFixed(1) : '0';
    const dislikesPercentage = totalResponses > 0 ? ((this.dislikesCount / totalResponses) * 100).toFixed(1) : '0';

    const likesCountElem = document.getElementById('likesCount');
    const dislikesCountElem = document.getElementById('dislikesCount');
    const likesPercentageElem = document.getElementById('likesPercentage');
    const dislikesPercentageElem = document.getElementById('dislikesPercentage');
    const incidentsCountElem = document.getElementById('incidentsCount');

    if (likesCountElem && dislikesCountElem && likesPercentageElem && dislikesPercentageElem && incidentsCountElem) {
      likesCountElem.textContent = this.likesCount.toString();
      dislikesCountElem.textContent = this.dislikesCount.toString();
      likesPercentageElem.textContent = `(${likesPercentage}%)`;
      dislikesPercentageElem.textContent = `(${dislikesPercentage}%)`;
      incidentsCountElem.textContent = (this.likesCount + this.dislikesCount).toString();
    }
  }

  handleResponse(response: string) {
    this.incidentsCount++;
    
    if (response === 'like') {
      this.likesCount++;
      this.dislikesCount = 0; // Reset dislikes count to 0
    } else if (response === 'dislike') {
      this.dislikesCount++;
      this.likesCount = 0; // Reset likes count to 0
    }
    
    this.updateStats();
  }
}
