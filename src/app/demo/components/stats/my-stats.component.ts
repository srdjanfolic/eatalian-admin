import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StatsService } from './stats.service';

@Component({
  selector: 'app-my-stats',
  templateUrl: './my-stats.component.html',
  styleUrls: ['./my-stats.component.scss']
})
export class MyStatsComponent implements OnInit {

  statsServiceSubscription= new Subscription();
  data: any;
  horizontalOptions: any;

  constructor(
    private statsService: StatsService
  ) { 
    this.horizontalOptions = {
      indexAxis: 'y',
      plugins: {
          legend: {
              labels: {
                  color: '#495057'
              }
          }
      },
      scales: {
          x: {
              ticks: {
                  color: '#495057'
              },
              grid: {
                  color: '#ebedef'
              }
          },
          y: {
              ticks: {
                  color: '#495057'
              },
              grid: {
                  color: '#ebedef'
              }
          }
      }
  };
  }

  ngOnInit(): void {
    this.statsServiceSubscription = this.statsService.getOwnStats().subscribe({
      next: (stats) => {
        console.log(stats);
        this.data = {
          labels: stats.orderLabels,
          datasets: [
              {
                  label: 'Ukupno ordera',
                  data: stats.orderCountData,
                  backgroundColor: '#42A5F5',
              },
              {
                  label: 'Ukupno para',
                  data: stats.orderSumData,
                  backgroundColor: '#FFA726',
              }
          ]
      }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

}
