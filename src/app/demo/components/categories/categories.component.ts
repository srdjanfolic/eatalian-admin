import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, PrimeNGConfig, SelectItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { getFormData } from '../../shared/sharedFunctions';

import { CategoriesService } from './categories.service';
import { DeleteManyCategoriesDto } from './dto/delete-many-categories.dto';
import { GetCategoryDto } from './dto/get-category.dto';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {

  sortOptions!: SelectItem[];
  sortOrder!: number;
  sortField!: string;
  sortKey?: any;

  categories: GetCategoryDto[] = [];
  selectedCategories: GetCategoryDto[] = [];
  clonedCategory!: GetCategoryDto;

  categoryDialog!: boolean;
  submitted!: boolean;
  editMode: boolean = false;
  index: number = -1;

  private getCategoriesSubscription!: Subscription;

  constructor(
    private categoriesService: CategoriesService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) { }


  trackCategory(index: number, category: GetCategoryDto) {
    return category ? category._id : undefined;

}

  ngOnInit(): void {
    this.getCategoriesSubscription = this.categoriesService.getCategories().subscribe(
      (categories: GetCategoryDto[]) => {
        this.categories= categories;
      }
    );
    this.sortOptions = [
      {label: 'A-Š', value: 'name'},
      {label: 'Š-A', value: '!name'}
  ];
  }

  ngOnDestroy(): void {
    this.getCategoriesSubscription.unsubscribe();
  }

  deleteSelectedCategories() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected categories?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let deleteManyCategoriesDto = new DeleteManyCategoriesDto();
        deleteManyCategoriesDto.ids = this.selectedCategories.map(category => category._id);
        this.categoriesService.deleteManyCategories(deleteManyCategoriesDto).subscribe({
          next: () => {
            this.categories= this.categories.filter(val => !this.selectedCategories.includes(val));
            this.selectedCategories = [];
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Categories Deleted', life: 3000 });
          },
          error: () => {
            this.selectedCategories = [];
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error deleting categories', life: 3000 });
          }
        });

      }
    });
  }

  openNew() {
    this.clonedCategory = {
      color: '#dee2e6'
    };
    this.submitted = false;
    this.categoryDialog = true;
  }

  hideDialog() {
    this.categoryDialog = false;
    this.submitted = false;
  }

  editCategory(category: GetCategoryDto) { 
    this.editMode = true;
    this.index = this.categories.indexOf(category);
    console.log(this.index);
    this.clonedCategory = {... category};
    this.submitted = false;
    this.categoryDialog = true;
    console.log(category, "kategorija na edit klik");
    console.log(this.clonedCategory, "clon kategorija na edit klik");
  }


  deleteCategory(category: GetCategoryDto) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + category.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.categoriesService.deleteCategory(category._id).subscribe({
          next: () => {
            this.categories= this.categories.filter(val => val._id !== category._id);
            this.clonedCategory = {};
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Category Deleted', life: 5000 });
          },
          error: () => {
            this.clonedCategory = {};
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error deleting category', life: 5000 });
          },
        });

      }
    });
  }

  saveCategory() {

    this.submitted = true;
    this.categoryDialog = false;
    let categoryFormData: FormData = getFormData(this.clonedCategory);

    this.categoriesService.createCategory(categoryFormData).subscribe({
      next: (createdCategory) => {
        this.categories = [...this.categories, createdCategory];
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Category created!', life: 3000 });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error creating category', life: 3000 });
      }
    });
  }
  
  updateCategory() {
    
    this.submitted = true;
    this.categoryDialog = false;
    this.editMode = false;
    console.log(this.clonedCategory, 'cloned prije snimanja');
    let categoryFormData: FormData = getFormData(this.clonedCategory);

    this.categoriesService.updateCategory(this.clonedCategory._id, categoryFormData).subscribe({
      next: (updatedCategory) => {
        console.log(updatedCategory, 'posle update-a');
          //const index = this.categories.indexOf(this.clonedCategory);
          console.log(this.index, "index");
          this.categories[this.index] = {...updatedCategory};
          this.categories = [...this.categories];
          console.log(this.categories, 'posle update-a kategorije');
          this.clonedCategory = {};
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Category updated!', life: 3000 });
      },
      error : () => {
        this.clonedCategory = {};
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error updating category', life: 5000 });
      }
    });
  }

  applyFilterGlobal(event: any) {
    return event.target.value;
  }

  uploadFile(event: { files: any; }) {
    this.clonedCategory.pictureFile = event.files[0];
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
