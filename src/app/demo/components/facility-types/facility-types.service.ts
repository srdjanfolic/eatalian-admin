import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GetFacilityTypeDto } from './dto/get-facility-type.dto';
import { CreateFacilityTypeDto } from './dto/create-facility-type.dto';
import { GetFacilityTypeListDto } from './dto/get-facility-type-list.dto';
import { DeleteManyFacilityTypesDto } from './dto/delete-many-facility-types.dto';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};


@Injectable({
  providedIn: 'root'
})
export class FacilityTypesService {

  private  facilityTypesURl = `${environment.apiURL}:${environment.apiPort}/facility-type`;

  constructor(
    private http: HttpClient
  ) {}

  getFacilityTypes() {
    return this.http.get<GetFacilityTypeDto[]>(
      `${this.facilityTypesURl}`
    );
  }

  getFacilityTypeList() {
    return this.http.get<GetFacilityTypeListDto[]>(
      `${this.facilityTypesURl}/list`
    );
  }
  
  createFacilityType(facilityType: CreateFacilityTypeDto){
    return this.http.post<GetFacilityTypeDto>(`${this.facilityTypesURl}`, facilityType);
  }

  updateFacilityType(id:string|undefined, facilityType: CreateFacilityTypeDto){
  
    return this.http.patch<GetFacilityTypeDto>(`${this.facilityTypesURl}/${id}`, facilityType);
  }

  deleteFacilityType(id: string|undefined){
    return this.http.delete<void>(`${this.facilityTypesURl}/${id}`,httpOptions);
  }

  deleteManyFacilityTypes(deleteManyFacilityTypes: DeleteManyFacilityTypesDto){
    return this.http.post<GetFacilityTypeDto>(`${this.facilityTypesURl}/many`, deleteManyFacilityTypes, httpOptions);
  }

}
