import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { Subscription } from 'rxjs';
import { GetFacilityDto } from './dto/get-facility-dto';
import { FacilitiesService } from './facilities.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { DeleteManyFacilitiesDto } from './dto/delete-many-facilities.dto';
import { getFormData, noWhitespaceValidator } from '../../shared/sharedFunctions';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxPhotoEditorService } from 'ngx-photo-editor';


@Component({
  selector: 'app-facilities',
  templateUrl: './facilities.component.html',
  styleUrls: ['./facilities.component.scss']
})
export class FacilitiesComponent implements OnInit, OnDestroy {


  facilities: GetFacilityDto[] = [];
  selectedFacilities: GetFacilityDto[] = [];
  facility!: GetFacilityDto;

  facilityDialog!: boolean;
  submitted!: boolean;
  editMode: boolean = false;
  facilityForm!: FormGroup;

  private getFacilitiesSubscription!: Subscription;

  constructor(
    private facilityService: FacilitiesService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private ngxPhotoEditorService: NgxPhotoEditorService
  ) { }



  ngOnInit(): void {
    this.getFacilitiesSubscription = this.facilityService.getFacilities().subscribe(
      (facilities: GetFacilityDto[]) => {
        this.facilities = facilities;
      }
    );
    this.facilityForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        noWhitespaceValidator,
      ]),
      title: new FormControl(null, [
        Validators.required,
        noWhitespaceValidator,
      ]),
      description: new FormControl(null, [
        Validators.required,
        noWhitespaceValidator,
      ]),
      locationURL: new FormControl(null, []),
      frameURL: new FormControl(null, []),
      city: new FormControl(null, [
        Validators.required,
        noWhitespaceValidator,
      ]),
      address: new FormControl(null, [
        Validators.required,
        noWhitespaceValidator,
      ]),
      phone: new FormControl(null, [
        Validators.required,
        noWhitespaceValidator,
      ]),
      username: new FormControl(null, [
        Validators.required,
        noWhitespaceValidator,
      ]),
      password: new FormControl(null, [
          Validators.required,
          noWhitespaceValidator,
        ]),
      pictureFile: new FormControl(null),
      closed: new FormControl(null),
      deleted: new FormControl(null),
    });
  }

  ngOnDestroy(): void {
    this.getFacilitiesSubscription.unsubscribe();
  }

  modalHide() {
    this.facilityForm.reset();
  }

  deleteSelectedFacilities() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected facilities?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let deleteManyFacilitiesDto = new DeleteManyFacilitiesDto();
        deleteManyFacilitiesDto.ids = this.selectedFacilities.map(facility => facility._id);
        this.facilityService.deleteManyFacilities(deleteManyFacilitiesDto).subscribe({
          next: () => {
            this.facilities = this.facilities.filter(val => !this.selectedFacilities.includes(val));
            this.selectedFacilities = [];
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Facilities Deleted', life: 3000 });
          },
          error: () => {
            this.selectedFacilities = [];
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error deleting facilities', life: 3000 });
          }
        });

      }
    });
  }

  openNew() {
    this.facility = {};
    this.submitted = false;
    this.facilityDialog = true;
    this.facilityForm.get('password')?.addValidators([Validators.required, noWhitespaceValidator]);
  }

  hideDialog() {
    this.facilityDialog = false;
    this.facilityForm.reset();
    this.submitted = false;
  }

  editFacility(facility: GetFacilityDto) {
    this.editMode = true;
    this.facility = facility;
    this.submitted = false;
    this.facilityDialog = true;
    this.facilityForm.patchValue(
      {
        "name" : facility.name,
        "title" : facility.title,
        "description" : facility.description,
        "locationURL" : facility.locationURL,
        "frameURL" : facility.frameURL,
        "phone" : facility.phone,
        "address" : facility.address,
        "city" : facility.city,
        "username" : facility.username,
        "closed" : facility.closed,
        "deleted" : facility.deleted
      }
    );
    this.facilityForm.get('password')?.clearValidators();
  }


  deleteFacility(facility: GetFacilityDto) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + facility.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.facilityService.deleteFacility(facility._id).subscribe({
          next: () => {
            this.facilities = this.facilities.filter(val => val._id !== facility._id);
            this.facility = {};
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Facility Deleted', life: 5000 });
          },
          error: () => {
            this.facility = {};
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error deleting facility', life: 5000 });
          },
        });

      }
    });
  }

  saveFacility() {
    
    this.submitted = true;
    this.facilityDialog = false;
    let facilityFormData: FormData = getFormData(this.facilityForm.getRawValue());
    this.facilityForm.reset();
    this.facilityService.createFacility(facilityFormData).subscribe({
      next: (createdFacility) => {
        this.facility = {};
        this.facilities.push(createdFacility);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Facility created!', life: 5000 });
      },
      error: () => {
        this.facility = {};
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error creating facility', life: 5000 });
      }
    });
  }

  updateFacility() {

    this.submitted = true;
    this.facilityDialog = false;
    this.editMode = false;
    let facilityFormData: FormData = getFormData(this.facilityForm.getRawValue());

    this.facilityService.updateFacility(this.facility._id, facilityFormData).subscribe({
      next: (updatedFacility) => {
        const index = this.facilities.indexOf(this.facility);
        this.facilities[index] = updatedFacility;
        console.log(updatedFacility, "RESPONSE")
        this.facility = {};
      },
      error: () => {
        this.facility = {};
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error updating facility', life: 5000 });
      }
    });
  }

  applyFilterGlobal(event: any) {
    return event.target.value;
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
      aspectRatio: 10 / 3,
      autoCropArea: 1,
      resizeToWidth: 1000,
      resizeToHeight: 300
    }).subscribe(data => {

      //this.clonedCategory.pictureFile = data.file;
      this.facilityForm.controls["pictureFile"].setValue(data.file);
    });
  }

}
