import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, PrimeNGConfig, SelectItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { getFormData, noWhitespaceValidator } from '../../shared/sharedFunctions';

import { DeleteManyProductsDto } from './dto/delete-many-products.dto';
import { GetProductDto } from './dto/get-product.dto';

import { NgxCroppedEvent, NgxPhotoEditorService } from "ngx-photo-editor";
import { ProductsService } from './products.service';
import { GetCategoryListDto } from '../categories/dto/get-category-list.dto';
import { UpdateSuggestedProductsDto } from './dto/update-suggested-products.dto';
import { FormControl, FormGroup, Validators } from '@angular/forms';


interface City {
  name: string,
  code: string
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})

export class ProductsComponent implements OnInit {

  sortOptions!: SelectItem[];
  sortOrder!: number;
  sortField!: string;
  sortKey?: any;

  products: GetProductDto[] = [];
  selectedProducts: GetProductDto[] = [];
  clonedProduct!: GetProductDto;
  categoriesList: GetCategoryListDto[] = [];
  selectedCategory?: GetCategoryListDto;

  realProducts: GetProductDto[] = [];
  addonProducts: GetProductDto[] = [];

  selectedSuggestedProducts?: any[];
  filteredSuggestedProducts!: any[];
  selectedSuggestedAddons?: any[];
  filteredSuggestedAddons!: any[];

  productDialog!: boolean;
  suggestedProductsDialog!: boolean;
  submitted!: boolean;
  editMode: boolean = false;
  index: number = -1;

  output?: NgxCroppedEvent;
  
  productForm!: FormGroup;


  private getProductsSubscription!: Subscription;
  private getCategoriesListSubscription!: Subscription;

  

  constructor(
    private productsService: ProductsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private ngxPhotoEditorService: NgxPhotoEditorService
  ) { }


  trackProduct(index: number, product: GetProductDto) {
    return product ? product._id : undefined;

  }

  fileChangeHandler($event: any, fileUpload: any) {
    const file = $event.currentFiles[0];
    let extensionAllowed = ["png", "jpeg", "jpg"];
    if (file!.size / 1024 / 1024 > 20) {
      alert("File size should be less than 20MB")
      fileUpload.clear()
      return;
    }
    if (extensionAllowed) {
      var nam = file!.name.split('.').pop() || "xxx";

      if (!extensionAllowed.includes(nam)) {
        alert("Please upload " + extensionAllowed.toString() + " file.")
        fileUpload.clear()
        return;
      }
    }
    this.ngxPhotoEditorService.open($event.currentFiles[0], {
      aspectRatio: 3 / 3,
      autoCropArea: 1,
      resizeToWidth: 300,
      resizeToHeight: 300
    }).subscribe(data => {
      //this.clonedProduct.pictureFile = data.file;
      this.productForm.controls["pictureFile"].setValue(data.file);
    });
  }

  ngOnInit(): void {
    this.getProductsSubscription = this.productsService.getProducts().subscribe(
      (products: GetProductDto[]) => {
        this.products = products;
        console.log(products, "Proizovdi");
      }
    );
    this.getCategoriesListSubscription = this.productsService.getCategoryList().subscribe(
      (categoriesList: GetCategoryListDto[]) => {
        this.categoriesList = categoriesList;
      }
    );

    this.sortOptions = [
      { label: 'A-Š', value: 'name' },
      { label: 'Š-A', value: '!name' }
    ];

    this.productForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        noWhitespaceValidator,
      ]),
      category: new FormControl(null, [
        Validators.required,
        noWhitespaceValidator,
      ]),
      description: new FormControl(null, [
        Validators.required,
        noWhitespaceValidator,
      ]),
      price: new FormControl(null, [
        Validators.required,
        noWhitespaceValidator,
      ]),
      isAddon: new FormControl(null),
      isFeatured: new FormControl(null),
      disabled: new FormControl(null),
      invisible: new FormControl(null),
      pictureFile: new FormControl(null),
    });
  }

  ngOnDestroy(): void {
    this.getProductsSubscription.unsubscribe();
    this.getCategoriesListSubscription.unsubscribe();
  }

  filterSuggestedProducts(event: { query: any; }) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.realProducts.length; i++) {
      let product = this.realProducts[i];
      if (product.name?.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(product);
      }
    }
    this.filteredSuggestedProducts = filtered;
  }

  filterSuggestedAddons(event: { query: any; }) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.addonProducts.length; i++) {
      let product = this.addonProducts[i];
      if (product.name?.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(product);
      }
    }

    this.filteredSuggestedAddons = filtered;
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let deleteManyProductsDto = new DeleteManyProductsDto();
        deleteManyProductsDto.ids = this.selectedProducts.map(product => product._id);
        this.productsService.deleteManyProducts(deleteManyProductsDto).subscribe({
          next: () => {
            this.products = this.products.filter(val => !this.selectedProducts.includes(val));
            this.selectedProducts = [];
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
          },
          error: () => {
            this.selectedProducts = [];
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error deleting products', life: 3000 });
          }
        });

      }
    });
  }

  openNew() {
    this.clonedProduct = {
      isFeatured: false,
      isAddon: false,
      disabled: false,
      invisible: false
    };
    this.selectedCategory = {};
    this.submitted = false;
    this.productDialog = true;
    this.editMode = false;
  }

  hideDialog() {
    this.productDialog = false;
    this.suggestedProductsDialog = false;
    this.productForm.reset();
    this.submitted = false;
  }

  editProduct(product: GetProductDto) {
    this.editMode = true;
    this.index = this.products.indexOf(product);
    this.clonedProduct = { ...product };
    this.productForm.patchValue(
      {
        "name" : product.name,
        "category": product.category,
        "description": product.description,
        "price": product.price,
        "isAddon": product.isAddon,
        "isFeatured": product.isFeatured,
        "disabled": product.disabled,
        "invisible": product.invisible,
      }
    );
    this.submitted = false;
    this.productDialog = true;
  }

  editSuggestedProducts(product: GetProductDto) {
    this.realProducts = this.products.filter(product => !product.isAddon);
    this.addonProducts = this.products.filter(product => product.isAddon);
    this.editMode = true;
    this.index = this.products.indexOf(product);
    this.clonedProduct = { ...product };
    this.selectedSuggestedProducts = this.clonedProduct.suggestedProducts;
    this.selectedSuggestedAddons = this.clonedProduct.suggestedAddons;
    this.selectedCategory = this.clonedProduct.category;
    this.submitted = false;
    this.suggestedProductsDialog = true;
  }


  deleteProduct(product: GetProductDto) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productsService.deleteProduct(product._id).subscribe({
          next: () => {
            this.products = this.products.filter(val => val._id !== product._id);
            this.clonedProduct = {};
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 5000 });
          },
          error: () => {
            this.clonedProduct = {};
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error deleting product', life: 5000 });
          },
        });

      }
    });
  }

  saveProduct() {

    this.submitted = true;
    this.productDialog = false;
    let productFormData: FormData = getFormData(this.productForm.getRawValue());
    this.productForm.reset();
    this.productsService.createProduct(productFormData).subscribe({
      next: (createdProduct) => {
        this.products = [...this.products, createdProduct];
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product created!', life: 3000 });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error creating product', life: 3000 });
      }
    });
  }

  updateProduct() {

    this.submitted = true;
    this.productDialog = false;
    this.editMode = false;
    let productFormData: FormData = getFormData(this.productForm.getRawValue());
    this.productForm.reset();
    this.productsService.updateProduct(this.clonedProduct._id, productFormData).subscribe({
      next: (updatedProduct) => {

        this.products[this.index] = { ...updatedProduct };
        this.products = [...this.products];
        this.clonedProduct = {};
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product updated!', life: 3000 });
      },
      error: () => {
        this.clonedProduct = {};
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error updating product', life: 5000 });
      }
    });
  }

  modalHide() {
    this.productForm.reset();
    this.editMode = false;
  }
  updateSuggestedProducts() {
    let updateSuggestedProductsDto = new UpdateSuggestedProductsDto(
      this.selectedSuggestedProducts?.map(item => item._id),
      this.selectedSuggestedAddons?.map(item => item._id)
    );

    this.submitted = true;
    this.suggestedProductsDialog = false;
    this.editMode = false;
    this.selectedSuggestedAddons = [];
    this.selectedSuggestedProducts = [];
  
    this.productsService.updateSuggestedProducts(this.clonedProduct._id, updateSuggestedProductsDto).subscribe({
      next: (updatedProduct) => {

        this.products[this.index] = { ...updatedProduct };
        this.products = [...this.products];
        this.clonedProduct = {};
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product updated!', life: 3000 });
      },
      error: () => {
        this.clonedProduct = {};
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error updating product', life: 5000 });
      }
    });
  }

  applyFilterGlobal(event: any) {
    return event.target.value;
  }

  uploadFile(event: { files: any; }) {
    this.clonedProduct.pictureFile = event.files[0];
  }

  onSortChange(event: { value: any; }) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    }
    else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }
}
