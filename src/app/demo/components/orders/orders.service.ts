import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GetOwnOrderFilterDto } from './dto/get-own-order-filter.dto';
import { GetOwnOrderListDto } from './dto/get-own-order-list.dto';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private  facilitiesURl = `${environment.apiURL}:${environment.apiPort}/facility`;

  constructor(
    private http: HttpClient
  ) {}

  getOwnOrders(getOwnOrderFilterDto: GetOwnOrderFilterDto) {
    return this.http.post<GetOwnOrderListDto>(
      `${this.facilitiesURl}/own/orders`,
      getOwnOrderFilterDto, httpOptions
    );
  }
  getOrders(getOwnOrderFilterDto: GetOwnOrderFilterDto) {
    return this.http.post<GetOwnOrderListDto>(
      `${this.facilitiesURl}/orders`,
      getOwnOrderFilterDto, httpOptions
    );
  }
  getOwnOrderById(id?: string) {
    return this.http.get<any>(
      `${this.facilitiesURl}/own/order/${id}`,
      httpOptions
    );
  }
  getOrderById(id?:string) {
    return this.http.get<any>(
      `${this.facilitiesURl}/order/${id}`,
      httpOptions
    );
  }
}
