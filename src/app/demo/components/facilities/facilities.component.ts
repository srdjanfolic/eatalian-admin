import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { Subscription } from 'rxjs';
import { GetFacilityDto } from './dto/get-facility-dto';
import { FacilitiesService } from './facilities.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { DeleteManyFacilitiesDto } from './dto/delete-many-facilities.dto';
import { getFormData } from '../../shared/sharedFunctions';


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

  private getFacilitiesSubscription!: Subscription;

  constructor(
    private facilityService: FacilitiesService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }



  ngOnInit(): void {
    this.getFacilitiesSubscription = this.facilityService.getFacilities().subscribe(
      (facilities: GetFacilityDto[]) => {
        this.facilities = facilities;
      }
    );
  }

  ngOnDestroy(): void {
    this.getFacilitiesSubscription.unsubscribe();
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
  }

  hideDialog() {
    this.facilityDialog = false;
    this.submitted = false;
  }

  editFacility(facility: GetFacilityDto) { 
    this.editMode = true;
    this.facility = facility;
    this.submitted = false;
    this.facilityDialog = true;
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
    let facilityFormData: FormData = getFormData(this.facility);

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
    let facilityFormData: FormData = getFormData(this.facility);

    this.facilityService.updateFacility(this.facility._id, facilityFormData).subscribe({
      next: (updatedFacility) => {
          const index = this.facilities.indexOf(this.facility);
          this.facilities[index] = updatedFacility;
          this.facility = {};
      },
      error : () => {
        this.facility = {};
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error updating facility', life: 5000 });
      }
    });
  }

  applyFilterGlobal(event: any) {
    return event.target.value;
  }

  uploadFile(event: { files: any; }) {
    this.facility.pictureFile = event.files[0];
  }

}
