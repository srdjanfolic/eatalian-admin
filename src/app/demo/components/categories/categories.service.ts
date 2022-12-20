import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private  categoriesURl = `${environment.apiURL}:${environment.apiPort}/category`;

  constructor(
    private http: HttpClient,
    private datepipe: DatePipe
  ) {}


}
