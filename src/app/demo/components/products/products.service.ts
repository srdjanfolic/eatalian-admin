import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GetCategoryListDto } from '../categories/dto/get-category-list.dto';
import { GetFacilityDto } from '../facilities/dto/get-facility-dto';
import { DeleteManyProductsDto } from './dto/delete-many-products.dto';
import { GetProductDto } from './dto/get-product.dto';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private  productsURl = `${environment.apiURL}:${environment.apiPort}/product`;
  private  categoriesURl = `${environment.apiURL}:${environment.apiPort}/category`;

  constructor(
    private http: HttpClient
  ) {}

  getProducts() {
    return this.http.get<GetProductDto[]>(
      `${this.productsURl}`
    );
  }

  getCategoryList() {
    return this.http.get<GetCategoryListDto[]>(
      `${this.categoriesURl}/list`
    );
  }
  createProduct(product: FormData){
    return this.http.post<GetProductDto>(`${this.productsURl}`, product);
  }


  updateProduct(id:string|undefined, product: FormData){
  
    return this.http.patch<GetProductDto>(`${this.productsURl}/${id}`, product);
  }

  deleteProduct(id: string|undefined){
    return this.http.delete<void>(`${this.productsURl}/${id}`,httpOptions);
  }

  deleteManyProducts(deleteManyProducts: DeleteManyProductsDto){
    return this.http.post<GetFacilityDto>(`${this.productsURl}/many`, deleteManyProducts, httpOptions);
  }


}
