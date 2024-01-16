import { Component, OnDestroy, OnInit } from '@angular/core';
import { GetFacilityTypeDto } from './dto/get-facility-type.dto';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { FacilityTypesService } from './facility-types.service';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { getFormData, noWhitespaceValidator } from '../../shared/sharedFunctions';
import { NgxCroppedEvent, NgxPhotoEditorService } from 'ngx-photo-editor';
import { DeleteManyFacilityTypesDto } from './dto/delete-many-facility-types.dto';

@Component({
  selector: 'app-facility-types',
  templateUrl: './facility-types.component.html',
  styleUrls: ['./facility-types.component.scss']
})
export class FacilityTypesComponent implements OnInit, OnDestroy {

  sortOptions!: SelectItem[];
  sortOrder!: number;
  sortField!: string;
  sortKey?: any;

  facilityTypes: GetFacilityTypeDto[] = [];
  selectedFacilityTypes: GetFacilityTypeDto[] = [];
  clonedFacilityType!: GetFacilityTypeDto;

  facilityTypeDialog!: boolean;
  submitted!: boolean;
  editMode: boolean = false;
  index: number = -1;

  output?: NgxCroppedEvent;

  private getFacilityTypesSubscription!: Subscription;
  facilityTypeForm!: FormGroup;

  constructor(
    private facilityTypesService: FacilityTypesService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private ngxPhotoEditorService: NgxPhotoEditorService
  ) { }


  trackFacilityType(index: number, facilityType: GetFacilityTypeDto) {
    return facilityType ? facilityType._id : undefined;

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

      //this.clonedFacilityType.pictureFile = data.file;
      this.facilityTypeForm.controls["pictureFile"].setValue(data.file);
    });
  }

  ngOnInit(): void {
    this.getFacilityTypesSubscription = this.facilityTypesService.getFacilityTypes().subscribe(
      (facilityTypes: GetFacilityTypeDto[]) => {
        this.facilityTypes = facilityTypes;
      }
    );
    this.sortOptions = [
      { label: 'A-Š', value: 'name' },
      { label: 'Š-A', value: '!name' }
    ];

    this.facilityTypeForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required as ValidatorFn,
        noWhitespaceValidator as ValidatorFn,
      ]),
      color: new FormControl(null),
      pictureFile: new FormControl(null),
    });

  }

  ngOnDestroy(): void {
    this.getFacilityTypesSubscription.unsubscribe();
  }

  deleteSelectedFacilityTypes() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected facilityTypes?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let deleteManyFacilityTypesDto = new DeleteManyFacilityTypesDto();
        deleteManyFacilityTypesDto.ids = this.selectedFacilityTypes.map(facilityType => facilityType._id);
        this.facilityTypesService.deleteManyFacilityTypes(deleteManyFacilityTypesDto).subscribe({
          next: () => {
            this.facilityTypes = this.facilityTypes.filter(val => !this.selectedFacilityTypes.includes(val));
            this.selectedFacilityTypes = [];
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'FacilityTypes Deleted', life: 3000 });
          },
          error: () => {
            this.selectedFacilityTypes = [];
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error deleting facilityTypes', life: 3000 });
          }
        });

      }
    });
  }

  openNew() {
    this.editMode = false;
    this.submitted = false;
    this.facilityTypeDialog = true;
  }

  hideDialog() {
    this.facilityTypeDialog = false;
    this.submitted = false;
    this.facilityTypeForm.reset();
  }

  editFacilityType(facilityType: GetFacilityTypeDto) {
    this.editMode = true;
    this.index = this.facilityTypes.indexOf(facilityType);
    this.clonedFacilityType = {...facilityType};
    this.facilityTypeForm.patchValue(
      {
        "name": facilityType.name,
        "color": facilityType.color
      }
    );
    this.submitted = false;
    this.facilityTypeDialog = true;
  }


  deleteFacilityType(facilityType: GetFacilityTypeDto) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + facilityType.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.facilityTypesService.deleteFacilityType(facilityType._id).subscribe({
          next: () => {
            this.facilityTypes = this.facilityTypes.filter(val => val._id !== facilityType._id);
            this.clonedFacilityType = {};
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'FacilityType Deleted', life: 5000 });
          },
          error: () => {
            this.clonedFacilityType = {};
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error deleting facilityType', life: 5000 });
          },
        });

      }
    });
  }

  saveFacilityType() {

    this.submitted = true;
    this.facilityTypeDialog = false;
    let facilityTypeFormData: FormData = getFormData(this.facilityTypeForm.getRawValue());
    this.facilityTypeForm.reset();

    this.facilityTypesService.createFacilityType(facilityTypeFormData).subscribe({
      next: (createdFacilityType) => {
        this.facilityTypes = [...this.facilityTypes, createdFacilityType];
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'FacilityType created!', life: 3000 });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error creating facilityType', life: 3000 });
      }
    });
  }

  modalHide() {
    this.facilityTypeForm.reset();
  }

  updateFacilityType() {

    this.submitted = true;
    this.facilityTypeDialog = false;
    this.editMode = false;
    let facilityTypeFormData: FormData = getFormData(this.facilityTypeForm.getRawValue());
    this.facilityTypeForm.reset();
    this.facilityTypesService.updateFacilityType(this.clonedFacilityType._id, facilityTypeFormData).subscribe({
      next: (updatedFacilityType) => {
        this.facilityTypes[this.index] = { ...updatedFacilityType };
        this.facilityTypes = [...this.facilityTypes];

        this.clonedFacilityType = {};
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'FacilityType updated!', life: 3000 });
      },
      error: () => {
        this.clonedFacilityType = {};
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error updating facilityType', life: 5000 });
      }
    });
  }

  applyFilterGlobal(event: any) {
    return event.target.value;
  }

  uploadFile(event: { files: any; }) {
    this.clonedFacilityType.pictureFile = event.files[0];
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
