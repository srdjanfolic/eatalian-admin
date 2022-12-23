import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GetFacilityDto } from './dto/get-facility-dto';
import { FacilitiesService } from './facilities.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { WorkingHours } from './dto/working-hours.dto';
import { getFormData } from '../../shared/sharedFunctions';



@Component({
  selector: 'app-facility',
  templateUrl: './facility.component.html',
  styleUrls: ['./facilities.component.scss']
})
export class FacilityComponent implements OnInit, OnDestroy {

  facility!: GetFacilityDto;
  clonedFacility!: GetFacilityDto;

  facilityDialog!: boolean;
  submitted!: boolean;
  editMode: boolean = false;
  mondayOpeningTime?: Date;
  tuesdayOpeningTime?: Date;
  wednesdayOpeningTime?: Date;
  thursdayOpeningTime?: Date;
  fridayOpeningTime?: Date;
  saturdayOpeningTime?: Date;
  sundayOpeningTime?: Date;
  mondayClosingTime?: Date;
  tuesdayClosingTime?: Date;
  wednesdayClosingTime?: Date;
  thursdayClosingTime?: Date;
  fridayClosingTime?: Date;
  saturdayClosingTime?: Date;
  sundayClosingTime?: Date;

  private getFacilitiesSubscription!: Subscription;

  constructor(
    private facilityService: FacilitiesService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  

  setHours() {

    this.mondayOpeningTime = new Date();
    this.mondayOpeningTime.setHours(this.facility.workingHours?.monday?.openingHours || 0, this.facility.workingHours?.monday?.openingMinutes,0, 0);
    this.mondayClosingTime = new Date();
    this.mondayClosingTime.setHours(this.facility.workingHours?.monday?.closingHours || 0, this.facility.workingHours?.monday?.closingMinutes,0, 0);

    this.tuesdayOpeningTime = new Date();
    this.tuesdayOpeningTime.setHours(this.facility.workingHours?.tuesday?.openingHours || 0, this.facility.workingHours?.tuesday?.openingMinutes,0, 0);
    this.tuesdayClosingTime = new Date();
    this.tuesdayClosingTime.setHours(this.facility.workingHours?.tuesday?.closingHours || 0, this.facility.workingHours?.tuesday?.closingMinutes,0, 0);

    this.wednesdayOpeningTime = new Date();
    this.wednesdayOpeningTime.setHours(this.facility.workingHours?.wednesday?.openingHours || 0, this.facility.workingHours?.wednesday?.openingMinutes,0, 0);
    this.wednesdayClosingTime = new Date();
    this.wednesdayClosingTime.setHours(this.facility.workingHours?.wednesday?.closingHours || 0, this.facility.workingHours?.wednesday?.closingMinutes,0, 0);

    this.thursdayOpeningTime = new Date();
    this.thursdayOpeningTime.setHours(this.facility.workingHours?.thursday?.openingHours || 0, this.facility.workingHours?.thursday?.openingMinutes,0, 0);
    this.thursdayClosingTime = new Date();
    this.thursdayClosingTime.setHours(this.facility.workingHours?.thursday?.closingHours || 0, this.facility.workingHours?.thursday?.closingMinutes,0, 0);

    this.fridayOpeningTime = new Date();
    this.fridayOpeningTime.setHours(this.facility.workingHours?.friday?.openingHours || 0, this.facility.workingHours?.friday?.openingMinutes,0, 0);
    this.fridayClosingTime = new Date();
    this.fridayClosingTime.setHours(this.facility.workingHours?.friday?.closingHours || 0, this.facility.workingHours?.friday?.closingMinutes,0, 0);

    this.saturdayOpeningTime = new Date();
    this.saturdayOpeningTime.setHours(this.facility.workingHours?.saturday?.openingHours || 0, this.facility.workingHours?.saturday?.openingMinutes,0, 0);
    this.saturdayClosingTime = new Date();
    this.saturdayClosingTime.setHours(this.facility.workingHours?.saturday?.closingHours || 0, this.facility.workingHours?.saturday?.closingMinutes,0, 0);

    this.sundayOpeningTime = new Date();
    this.sundayOpeningTime.setHours(this.facility.workingHours?.sunday?.openingHours || 0, this.facility.workingHours?.sunday?.openingMinutes,0, 0);
    this.sundayClosingTime = new Date();
    this.sundayClosingTime.setHours(this.facility.workingHours?.sunday?.closingHours || 0, this.facility.workingHours?.sunday?.closingMinutes,0, 0);


  }

  ngOnInit(): void {
    this.getFacilitiesSubscription = this.facilityService.getOwnFacility().subscribe(
      (facility: GetFacilityDto) => {
        this.facility = facility;
        this.setHours();
      }
    );
  }

  ngOnDestroy(): void {
    this.getFacilitiesSubscription.unsubscribe();
  }

 

  hideDialog() {
    this.facilityDialog = false;
    this.clonedFacility = this.facility;
    this.submitted = false;
  }

  editFacility() {
    this.clonedFacility = this.facility;
    this.editMode = true;
    this.submitted = false;
    this.facilityDialog = true;
  }


  updateFacility() {
    
    this.submitted = true;
    this.facilityDialog = false;
    this.editMode = false;
    this.clonedFacility.workingHours!.monday = new WorkingHours("PON", this.mondayOpeningTime!.getHours(), this.mondayOpeningTime!.getMinutes(), this.mondayClosingTime!.getHours(), this.mondayClosingTime!.getMinutes());
    this.clonedFacility.workingHours!.tuesday = new WorkingHours("UTO", this.tuesdayOpeningTime!.getHours(), this.tuesdayOpeningTime!.getMinutes(), this.tuesdayClosingTime!.getHours(), this.tuesdayClosingTime!.getMinutes());
    this.clonedFacility.workingHours!.wednesday = new WorkingHours("SRI", this.wednesdayOpeningTime!.getHours(), this.wednesdayOpeningTime!.getMinutes(), this.wednesdayClosingTime!.getHours(), this.wednesdayClosingTime!.getMinutes());
    this.clonedFacility.workingHours!.thursday = new WorkingHours("ČET", this.thursdayOpeningTime!.getHours(), this.thursdayOpeningTime!.getMinutes(), this.thursdayClosingTime!.getHours(), this.thursdayClosingTime!.getMinutes());
    this.clonedFacility.workingHours!.friday = new WorkingHours("PET", this.fridayOpeningTime!.getHours(), this.fridayOpeningTime!.getMinutes(), this.fridayClosingTime!.getHours(), this.fridayClosingTime!.getMinutes());
    this.clonedFacility.workingHours!.saturday = new WorkingHours("SUB", this.saturdayOpeningTime!.getHours(), this.saturdayOpeningTime!.getMinutes(), this.saturdayClosingTime!.getHours(), this.saturdayClosingTime!.getMinutes());
    this.clonedFacility.workingHours!.sunday = new WorkingHours("NED", this.sundayOpeningTime!.getHours(), this.sundayOpeningTime!.getMinutes(), this.sundayClosingTime!.getHours(), this.sundayClosingTime!.getMinutes());
    
    let facilityFormData: FormData = getFormData(this.clonedFacility);

    this.facilityService.updateOwnFacility(this.clonedFacility._id, facilityFormData).subscribe({
      next: (updatedFacility) => {
          this.facility=updatedFacility;
          this.clonedFacility = {};
      },
      error : () => {
        this.clonedFacility = {};
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error updating facility', life: 5000 });
      }
    });
  }
  applyFilterGlobal(event: any) {
    return event.target.value;
  }

 
  uploadFile(event: { files: any; }) {
    console.log(event.files[0]);
    this.clonedFacility.pictureFile = event.files[0];
  }

}
