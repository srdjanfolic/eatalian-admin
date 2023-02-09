import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GetFacilityListDto } from '../facilities/dto/get-facility-list.dto';
import { FacilitiesService } from '../facilities/facilities.service';
import { PredefinedInterval } from './dto/predefined-interval.enum';
import { StatsFilterDto } from './dto/stats-fliter-dto';
import { TimeScale } from './dto/time-scale.enum';
import { StatsService } from './stats.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit, OnDestroy {

  statsServiceSubscription = new Subscription();
  faciltiesSubscription = new Subscription();

  facilities: GetFacilityListDto[] = [];
  facility?: string;

  
  data: any;
  ordersCountData: any;
  ordersSumData: any;
  horizontalOptions: any;

  statsFilterDto = new StatsFilterDto(undefined, undefined, undefined, undefined);
  rangeDates?: Date[];
  predefinedDate?: PredefinedInterval;
  scale?: TimeScale;

  scales: any[] = [
    { label: "Dan", value: TimeScale.DAY},
    { label: "Nedelja", value: TimeScale.WEEK},
    { label: "Mjesec", value: TimeScale.MONTH},
    { label: "Godina", value: TimeScale.YEAR},
  ];



  predefinedDates = [
    { label: "Danas", value: PredefinedInterval.TODAY },
    { label: "Juče", value: PredefinedInterval.YESTERDAY },
    { label: "Zadnjih 7 dana", value: PredefinedInterval.DAYS7 },
    { label: "Zadnjih 15 dana", value: PredefinedInterval.DAYS15 },
    { label: "Zadnjih 30 dana", value: PredefinedInterval.DAYS30 },
  ];


  constructor(
    private statsService: StatsService,
    private facilitiesService: FacilitiesService
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
    this.loadFacilities();
    this.loadStats();
  }

  loadFacilities() {
    this.faciltiesSubscription = this.facilitiesService.getFacilitiesList().subscribe(
      {
        next: (facilities) => {
          this.facilities = facilities;
          console.log(facilities);
        },
        error: (error) => {
          console.log(error)
        }
      }
    );
  }

  loadStats() {

    this.statsServiceSubscription = this.statsService.getStats(this.statsFilterDto).subscribe({
      next: (stats) => {
        console.log(stats);
        this.ordersSumData = {
          labels: stats.orderLabels,
          datasets: [
            {
              label: 'Ukupno para',
              data: stats.orderSumData,
              backgroundColor: '#FFA726',
            }
          ]
        };
        this.ordersCountData = {
          labels: stats.orderLabels,
          datasets: [
            {
              label: 'Ukupno ordera',
              data: stats.orderCountData,
              backgroundColor: '#42A5F5',
            },
          ]
        };
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  onFilter(x: any) {
    console.log(x, "FILTER ")
    console.log(this.predefinedDate, this.rangeDates, this.scale)
    this.statsFilterDto.startDate = this.rangeDates == null ? undefined : this.rangeDates[0];
    this.statsFilterDto.endDate = this.rangeDates == null ? undefined : this.rangeDates[1];
    if(this.statsFilterDto.startDate == null || this.statsFilterDto.endDate == null) {
      this.rangeDates = [];
      this.statsFilterDto.startDate=undefined;
      this.statsFilterDto.endDate=undefined;
    }

    this.statsFilterDto.scale = this.scale ?? undefined;
    this.statsFilterDto.facility_id = this.facility ?? undefined;
    this.statsFilterDto.predefinedInterval = this.predefinedDate ?? undefined;
    this.loadStats();
  }

  ngOnDestroy() {
    this.statsServiceSubscription.unsubscribe();
    this.faciltiesSubscription.unsubscribe();
  }

}
