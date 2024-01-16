import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GetFacilityDto } from '../facilities/dto/get-facility-dto';
import { DeleteManyCategoriesDto } from './dto/delete-many-categories.dto';
import { GetCategoryListDto } from './dto/get-category-list.dto';
import { GetCategoryDto } from './dto/get-category.dto';

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
    private http: HttpClient
  ) {}

  getCategories() {
    return this.http.get<GetCategoryDto[]>(
      `${this.categoriesURl}`
    );
  }
  getCategoriesList() {
    return this.http.get<GetCategoryListDto[]>(
      `${this.categoriesURl}/list`
    );
  }
  createCategory(category: FormData){
    return this.http.post<GetCategoryDto>(`${this.categoriesURl}`, category);
  }

  updateCategory(id:string|undefined, category: FormData){
  
    return this.http.patch<GetCategoryDto>(`${this.categoriesURl}/${id}`, category);
  }

  deleteCategory(id: string|undefined){
    return this.http.delete<void>(`${this.categoriesURl}/${id}`,httpOptions);
  }

  deleteManyCategories(deleteManyCategories: DeleteManyCategoriesDto){
    return this.http.post<GetCategoryDto>(`${this.categoriesURl}/many`, deleteManyCategories, httpOptions);
  }


}
