import { Component, OnDestroy, OnInit } from '@angular/core';
import { GetFacilityTypeDto } from './dto/get-facility-type.dto';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { FacilityTypesService } from './facility-types.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { noWhitespaceValidator } from '../../shared/sharedFunctions';

@Component({
  selector: 'app-facility-types',
  templateUrl: './facility-types.component.html',
  styleUrls: ['./facility-types.component.scss']
})
export class FacilityTypesComponent implements OnInit, OnDestroy {

  facilityTypes: GetFacilityTypeDto[] = [];
  facilityType!: GetFacilityTypeDto;

  facilityTypeDialog!: boolean;
  submitted!: boolean;
  editMode: boolean = false;
  index: number = -1;

  private getFacilityTypesSubscription!: Subscription;
  facilityTypeForm!: FormGroup;


  constructor(
    private facilityTypesService: FacilityTypesService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.getFacilityTypesSubscription = this.facilityTypesService.getFacilityTypes().subscribe(
      (facilityTypes: GetFacilityTypeDto[]) => {
        this.facilityTypes = facilityTypes;
        console.log(facilityTypes);
      }
    );
   

    this.facilityTypeForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required as ValidatorFn,
        noWhitespaceValidator as ValidatorFn,
      ])
    });

  }

  ngOnDestroy(): void {
    this.getFacilityTypesSubscription.unsubscribe();
  }

  applyFilterGlobal(event: any) {
    return event.target.value;
  }

  openNew() {
    this.facilityType = {};
    this.submitted = false;
    this.facilityTypeDialog = true;
    this.facilityTypeForm.get('name')?.addValidators([Validators.required as ValidatorFn, noWhitespaceValidator as ValidatorFn]);
  }

  editFacilityType(facilityType: GetFacilityTypeDto) {
    this.editMode = true;
    this.index = this.facilityTypes.indexOf(facilityType);
    console.log(this.index);
    this.facilityType = {...facilityType};
    this.facilityTypeForm.patchValue(
      {
        "name": facilityType.name,
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
            this.facilityType = {};
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Facility Type Deleted', life: 5000 });
          },
          error: () => {
            this.facilityType = {};
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error deleting Facility Type', life: 5000 });
          },
        });

      }
    });
  }

  hideDialog() {
    this.facilityTypeDialog = false;
    this.facilityTypeForm.reset();
    this.submitted = false;
  }

  modalHide() {
    this.facilityTypeForm.reset();
  }

  saveFacilityType() {
    
    this.submitted = true;
    this.facilityTypeDialog = false;
    let facilityTypeFormData: FormData = this.facilityTypeForm.getRawValue();
    this.facilityTypeForm.reset();
    this.facilityTypesService.createFacilityType(facilityTypeFormData).subscribe({
      next: (createdFacilityType) => {
        this.facilityType = {};
        this.facilityTypes.push(createdFacilityType);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Facility type created!', life: 5000 });
      },
      error: () => {
        this.facilityType = {};
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error creating facility type', life: 5000 });
      }
    });
  }

  updateFacilityType() {

    this.submitted = true;
    this.facilityTypeDialog = false;
    this.editMode = false;

    this.facilityTypesService.updateFacilityType(this.facilityType._id, this.facilityTypeForm.getRawValue()).subscribe({
      next: (updatedFacilityType) => {
       
        this.facilityTypes[this.index] = { ...updatedFacilityType };
        this.facilityTypes = [...this.facilityTypes];
        console.log(this.facilityTypes, 'posle update-a kategorije');
        this.facilityType = {};
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Facility Type updated!', life: 3000 });
      },
      error: () => {
        this.facilityType = {};
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error updating Facility Type', life: 5000 });
      }
    });
  }

}
