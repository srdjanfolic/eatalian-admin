import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, PrimeNGConfig, SelectItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { getFormData, noWhitespaceValidator } from '../../shared/sharedFunctions';

import { CategoriesService } from './categories.service';
import { DeleteManyCategoriesDto } from './dto/delete-many-categories.dto';
import { GetCategoryDto } from './dto/get-category.dto';

import { NgxCroppedEvent, NgxPhotoEditorService } from "ngx-photo-editor";
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { SafeResourceUrl } from '@angular/platform-browser';

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
  clonedCategories: GetCategoryDto[] = [];
  selectedCategories: GetCategoryDto[] = [];
  clonedCategory!: GetCategoryDto;
  previewImage?: SafeResourceUrl;

  categoryDialog!: boolean;
  submitted!: boolean;
  editMode: boolean = false;
  index: number = -1;

  output?: NgxCroppedEvent;

  private getCategoriesSubscription!: Subscription;
  categoryForm!: FormGroup;

  constructor(
    private categoriesService: CategoriesService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private ngxPhotoEditorService: NgxPhotoEditorService
  ) { }


  trackCategory(index: number, category: GetCategoryDto) {
    return category ? category._id : undefined;

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
      aspectRatio: 3 / 2,
      autoCropArea: 1,
      resizeToWidth: 300,
      resizeToHeight: 200
    }).subscribe(data => {

      this.previewImage = data.base64;
      this.categoryForm.controls["pictureFile"].setValue(data.file);
    });
  }

  ngOnInit(): void {
    this.getCategoriesSubscription = this.categoriesService.getCategories().subscribe(
      (categories: GetCategoryDto[]) => {
        this.categories = categories;
        this.clonedCategories = categories;
      }
    );
    this.sortOptions = [
      { label: 'A-Š', value: 'name' },
      { label: 'Š-A', value: '!name' }
    ];

    this.categoryForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required as ValidatorFn,
        noWhitespaceValidator as ValidatorFn,
      ]),
      color: new FormControl(null),
      pictureFile: new FormControl(null),
      sortIndex: new FormControl(1000),
    });

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
    this.previewImage = undefined;
    this.editMode = false;
    this.submitted = false;
    this.categoryDialog = true;
  }

  hideDialog() {
    this.categoryDialog = false;
    this.submitted = false;
    this.categoryForm.reset();
  }

  editCategory(category: GetCategoryDto) {
    this.editMode = true;
    this.index = this.categories.indexOf(category);
    this.clonedCategory = {...category};
    this.previewImage= this.clonedCategory.image;
    this.categoryForm.patchValue(
      {
        "name": category.name,
        "color": category.color,
        "sortIndex": category.sortIndex
      }
    );
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
    let categoryFormData: FormData = getFormData(this.categoryForm.getRawValue());
    this.categoryForm.reset();

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

  modalHide() {
    this.categoryForm.reset();
  }

  updateCategory() {

    this.submitted = true;
    this.categoryDialog = false;
    this.editMode = false;
    let categoryFormData: FormData = getFormData(this.categoryForm.getRawValue());
    this.categoryForm.reset();
    this.categoriesService.updateCategory(this.clonedCategory._id, categoryFormData).subscribe({
      next: (updatedCategory) => {
        this.categories[this.index] = { ...updatedCategory };
        this.categories = [...this.categories];

        this.clonedCategory = {};
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Category updated!', life: 3000 });
      },
      error: () => {
        this.clonedCategory = {};
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error updating category', life: 5000 });
      }
    });
  }

  applyFilterGlobal(event: any) {

    const chars = {
      'Š': 'S',
      'Đ': 'DJ',
      'Č': 'C',
      'Ć': 'C',
      'Ž': 'Z'
    };
    //return event.target.value;
    if (event.target.value.trim() !== "") {
      this.categories = this.clonedCategories.filter(
        category => category.name?.toUpperCase().replace(/[ŠĐČĆŽ]/g, (m: string | number) => (chars as any)[m]).includes(event.target.value.trim().toLocaleUpperCase().replace(/[ŠĐČĆŽ]/g, (m: string | number) => (chars as any)[m]).trim()))
    } else
      this.categories = this.clonedCategories;
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
