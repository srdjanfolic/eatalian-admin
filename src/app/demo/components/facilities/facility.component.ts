import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GetFacilityDto } from './dto/get-facility-dto';
import { FacilitiesService } from './facilities.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';



@Component({
  selector: 'app-facility',
  templateUrl: './facility.component.html',
  styleUrls: ['./facilities.component.scss']
})
export class FacilityComponent implements OnInit, OnDestroy {

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

  getFormData(object: any) {
    const formData = new FormData();
    Object.keys(object).forEach(key => formData.append(key, object[key]));
    return formData;
  }


  ngOnInit(): void {
    this.getFacilitiesSubscription = this.facilityService.getOwnFacility().subscribe(
      (facility: GetFacilityDto) => {
        this.facility = facility;
      }
    );
  }

  ngOnDestroy(): void {
    this.getFacilitiesSubscription.unsubscribe();
  }

 

  hideDialog() {
    this.facilityDialog = false;
    this.submitted = false;
  }

  editFacility(facility: GetFacilityDto) { 
    this.editMode = true;
    this.submitted = false;
    this.facilityDialog = true;
  }


  updateFacility() {
    
    this.submitted = true;
    this.facilityDialog = false;
    this.editMode = false;
    let facilityFormData: FormData = this.getFormData(this.facility);

    this.facilityService.updateOwnFacility(this.facility._id, facilityFormData).subscribe({
      next: (updatedFacility) => {
          this.facility=updatedFacility;
          this.facility = {};
      },
      error : () => {
        this.facility = {};
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error updating facility', life: 5000 });
      }
    });
  }
  uploadFile(event: { files: any; }) {
    this.facility.pictureFile = event.files[0];
  }

}
