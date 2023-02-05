import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GetOwnOrderListDto } from './dto/get-own-order.dto';

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

  getOwnOrders() {
    return this.http.get<GetOwnOrderListDto[]>(
      `${this.facilitiesURl}/own/orders`
    );
  }
}
