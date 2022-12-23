import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { exit } from 'process';
import { Subscription } from 'rxjs';
import { getFormData } from '../../shared/sharedFunctions';

import { CategoriesService } from './categories.service';
import { DeleteManyCategoriesDto } from './dto/delete-many-categories.dto';
import { GetCategoryDto } from './dto/get-category.dto';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  categories: GetCategoryDto[] = [];
  selectedCategories: GetCategoryDto[] = [];
  category!: GetCategoryDto;

  categoryDialog!: boolean;
  submitted!: boolean;
  editMode: boolean = false;

  private getCategoriesSubscription!: Subscription;

  constructor(
    private categoriesService: CategoriesService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }



  ngOnInit(): void {
    this.getCategoriesSubscription = this.categoriesService.getCategories().subscribe(
      (categories: GetCategoryDto[]) => {
        this.categories = categories;
      }
    );
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
            this.categories = this.categories.filter(val => !this.selectedCategories.includes(val));
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
    this.category = {
      color: '#c75a5a'
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
    this.category = category;
    this.submitted = false;
    this.categoryDialog = true;
  }


  deleteCategory(category: GetCategoryDto) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + category.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.categoriesService.deleteCategory(category._id).subscribe({
          next: () => {
            this.categories = this.categories.filter(val => val._id !== category._id);
            this.category = {};
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Category Deleted', life: 5000 });
          },
          error: () => {
            this.category = {};
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error deleting category', life: 5000 });
          },
        });

      }
    });
  }

  saveCategory() {

    this.submitted = true;
    this.categoryDialog = false;
    let categoryFormData: FormData = getFormData(this.category);

    this.categoriesService.createCategory(categoryFormData).subscribe({
      next: (createdCategory) => {
        this.category = {};
        this.categories.push(createdCategory);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Category created!', life: 5000 });
      },
      error: () => {
        this.category = {};
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error creating category', life: 5000 });
      }
    });
  }
  
  updateCategory() {
    
    this.submitted = true;
    this.categoryDialog = false;
    this.editMode = false;
    let categoryFormData: FormData = getFormData(this.category);

    this.categoriesService.updateCategory(this.category._id, categoryFormData).subscribe({
      next: (updatedCategory) => {
          const index = this.categories.indexOf(this.category);
          this.categories[index] = updatedCategory;
          this.category = {};
      },
      error : () => {
        this.category = {};
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error updating category', life: 5000 });
      }
    });
  }

  applyFilterGlobal(event: any) {
    return event.target.value;
  }

  uploadFile(event: { files: any; }) {
    this.category.pictureFile = event.files[0];
  }
}
