import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { DeleteManyFacilitiesDto } from './dto/delete-many-facilities.dto';
import { GetFacilityDto } from './dto/get-facility-dto';
import { GetFacilityListDto } from './dto/get-facility-list.dto';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class FacilitiesService {

  private  facilitiesURl = `${environment.apiURL}:${environment.apiPort}/facility`;

  constructor(
    private http: HttpClient,
  ) {}

  /**ADMIN PART */
  getFacilities() {
    return this.http.get<GetFacilityDto[]>(
      `${this.facilitiesURl}`
    );
  }
  getFacilitiesList() {
    return this.http.get<GetFacilityListDto[]>(
      `${this.facilitiesURl}/list`
    );
  }

  createFacility(facility: FormData){
    return this.http.post<GetFacilityDto>(`${this.facilitiesURl}`, facility);
  }

  updateFacility(id:string|undefined, facility: FormData){
    return this.http.patch<GetFacilityDto>(`${this.facilitiesURl}/${id}`, facility);
  }

  deleteFacility(id: string|undefined){
    return this.http.delete<void>(`${this.facilitiesURl}/${id}`,httpOptions);
  }
  deleteManyFacilities(deleteManyFacilities: DeleteManyFacilitiesDto){
    return this.http.post<GetFacilityDto>(`${this.facilitiesURl}/many`, deleteManyFacilities, httpOptions);
  }

  /**ADMIN PART */

  /**FACILITY PART */

  getOwnFacility() {
    return this.http.get<GetFacilityDto>(
      `${this.facilitiesURl}/own`
    );
  }

  updateOwnFacility(id:string|undefined, facility: FormData){
    return this.http.patch<GetFacilityDto>(`${this.facilitiesURl}/own`, facility);
  }
  /**FACILITY PART */

  
}
