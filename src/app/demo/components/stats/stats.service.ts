import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StatsFilterDto } from './dto/stats-fliter-dto';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  private statsURl = `${environment.apiURL}:${environment.apiPort}/stats`;

  constructor(
    private http: HttpClient
  ) { }

  getOwnStats(statsFilterDto: StatsFilterDto) {
    return this.http.post<any>(
      `${this.statsURl}/own`, statsFilterDto, httpOptions
    );
  }

}
