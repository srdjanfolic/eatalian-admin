import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GetFacilityDto } from './dto/get-facility-dto';
import { FacilitiesService } from './facilities.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { WorkingHours } from './dto/working-hours.dto';
import { getFormData, noWhitespaceValidator } from '../../shared/sharedFunctions';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgxPhotoEditorService } from 'ngx-photo-editor';
import { NumberFormatStyle } from '@angular/common';

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

  facilityForm!: FormGroup;

  private getFacilitiesSubscription!: Subscription;

  constructor(
    private facilityService: FacilitiesService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private ngxPhotoEditorService: NgxPhotoEditorService
  ) { }


  validDeliveryTime(control: AbstractControl): ValidationErrors | null {

    const from = control.get("deliveryTimeFrom")?.value;
    const to = control.get("deliveryTimeTo")?.value;
    if (from > to)
      return { 'invalidInterval': true };
    return null;
  }

  setHours() {

    this.mondayOpeningTime = new Date();
    this.mondayOpeningTime.setHours(this.facility.workingHours?.monday?.openingHours || 0, this.facility.workingHours?.monday?.openingMinutes, 0, 0);
    this.mondayClosingTime = new Date();
    this.mondayClosingTime.setHours(this.facility.workingHours?.monday?.closingHours || 0, this.facility.workingHours?.monday?.closingMinutes, 0, 0);

    this.tuesdayOpeningTime = new Date();
    this.tuesdayOpeningTime.setHours(this.facility.workingHours?.tuesday?.openingHours || 0, this.facility.workingHours?.tuesday?.openingMinutes, 0, 0);
    this.tuesdayClosingTime = new Date();
    this.tuesdayClosingTime.setHours(this.facility.workingHours?.tuesday?.closingHours || 0, this.facility.workingHours?.tuesday?.closingMinutes, 0, 0);

    this.wednesdayOpeningTime = new Date();
    this.wednesdayOpeningTime.setHours(this.facility.workingHours?.wednesday?.openingHours || 0, this.facility.workingHours?.wednesday?.openingMinutes, 0, 0);
    this.wednesdayClosingTime = new Date();
    this.wednesdayClosingTime.setHours(this.facility.workingHours?.wednesday?.closingHours || 0, this.facility.workingHours?.wednesday?.closingMinutes, 0, 0);

    this.thursdayOpeningTime = new Date();
    this.thursdayOpeningTime.setHours(this.facility.workingHours?.thursday?.openingHours || 0, this.facility.workingHours?.thursday?.openingMinutes, 0, 0);
    this.thursdayClosingTime = new Date();
    this.thursdayClosingTime.setHours(this.facility.workingHours?.thursday?.closingHours || 0, this.facility.workingHours?.thursday?.closingMinutes, 0, 0);

    this.fridayOpeningTime = new Date();
    this.fridayOpeningTime.setHours(this.facility.workingHours?.friday?.openingHours || 0, this.facility.workingHours?.friday?.openingMinutes, 0, 0);
    this.fridayClosingTime = new Date();
    this.fridayClosingTime.setHours(this.facility.workingHours?.friday?.closingHours || 0, this.facility.workingHours?.friday?.closingMinutes, 0, 0);

    this.saturdayOpeningTime = new Date();
    this.saturdayOpeningTime.setHours(this.facility.workingHours?.saturday?.openingHours || 0, this.facility.workingHours?.saturday?.openingMinutes, 0, 0);
    this.saturdayClosingTime = new Date();
    this.saturdayClosingTime.setHours(this.facility.workingHours?.saturday?.closingHours || 0, this.facility.workingHours?.saturday?.closingMinutes, 0, 0);

    this.sundayOpeningTime = new Date();
    this.sundayOpeningTime.setHours(this.facility.workingHours?.sunday?.openingHours || 0, this.facility.workingHours?.sunday?.openingMinutes, 0, 0);
    this.sundayClosingTime = new Date();
    this.sundayClosingTime.setHours(this.facility.workingHours?.sunday?.closingHours || 0, this.facility.workingHours?.sunday?.closingMinutes, 0, 0);


  }

  ngOnInit(): void {
    this.getFacilitiesSubscription = this.facilityService.getOwnFacility().subscribe(
      (facility: GetFacilityDto) => {
        this.facility = facility;
        this.setHours();
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
      password: new FormControl(null),
      pictureFile: new FormControl(null),
      mondayOpeningTime: new FormControl(null, [
        Validators.required,
        noWhitespaceValidator,
      ]),
      mondayClosingTime: new FormControl(null, [
        Validators.required,
        noWhitespaceValidator,
      ]),
      tuesdayOpeningTime: new FormControl(null, [
        Validators.required,
        noWhitespaceValidator,
      ]),
      tuesdayClosingTime: new FormControl(null, [
        Validators.required,
        noWhitespaceValidator,
      ]),
      wednesdayOpeningTime: new FormControl(null, [
        Validators.required,
        noWhitespaceValidator,
      ]),
      wednesdayClosingTime: new FormControl(null, [
        Validators.required,
        noWhitespaceValidator,
      ]),
      thursdayOpeningTime: new FormControl(null, [
        Validators.required,
        noWhitespaceValidator,
      ]),
      thursdayClosingTime: new FormControl(null, [
        Validators.required,
        noWhitespaceValidator,
      ]),
      fridayOpeningTime: new FormControl(null, [
        Validators.required,
        noWhitespaceValidator,
      ]),
      fridayClosingTime: new FormControl(null, [
        Validators.required,
        noWhitespaceValidator,
      ]),
      saturdayOpeningTime: new FormControl(null, [
        Validators.required,
        noWhitespaceValidator,
      ]),
      saturdayClosingTime: new FormControl(null, [
        Validators.required,
        noWhitespaceValidator,
      ]),
      sundayOpeningTime: new FormControl(null, [
        Validators.required,
        noWhitespaceValidator,
      ]),
      sundayClosingTime: new FormControl(null, [
        Validators.required,
        noWhitespaceValidator,
      ]),
      deliveryTimeFrom: new FormControl(null, [
        Validators.required,
        noWhitespaceValidator,
      ]),
      deliveryTimeTo: new FormControl(null, [
        Validators.required,
        noWhitespaceValidator,
      ]),
    },
    {validators: [this.validDeliveryTime]}
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
    this.setHours();
    this.facilityForm.patchValue(
      {
        "name": this.facility.name,
        "title": this.facility.title,
        "description": this.facility.description,
        "locationURL": this.facility.locationURL,
        "frameURL": this.facility.frameURL,
        "phone": this.facility.phone,
        "address": this.facility.address,
        "city": this.facility.city,
        "username": this.facility.username,
        "mondayOpeningTime": this.mondayOpeningTime,
        "mondayClosingTime": this.mondayClosingTime,
        "tuesdayOpeningTime": this.tuesdayOpeningTime,
        "tuesdayClosingTime": this.tuesdayClosingTime,
        "wednesdayOpeningTime": this.wednesdayOpeningTime,
        "wednesdayClosingTime": this.wednesdayClosingTime,
        "thursdayOpeningTime": this.thursdayOpeningTime,
        "thursdayClosingTime": this.thursdayClosingTime,
        "fridayOpeningTime": this.fridayOpeningTime,
        "fridayClosingTime": this.fridayClosingTime,
        "saturdayOpeningTime": this.saturdayOpeningTime,
        "saturdayClosingTime": this.saturdayClosingTime,
        "sundayOpeningTime": this.sundayOpeningTime,
        "sundayClosingTime": this.sundayClosingTime,
        "deliveryTimeFrom": this.facility.deliveryTime?.from,
        "deliveryTimeTo": this.facility.deliveryTime?.to,
      }
    );
    this.editMode = true;
    this.submitted = false;
    this.facilityDialog = true;
  }


  form2facility() {
    let formValues = this.facilityForm.getRawValue();
    this.clonedFacility.name = formValues.name;
    this.clonedFacility.title = formValues.title;
    this.clonedFacility.description = formValues.description;
    this.clonedFacility.locationURL = formValues.locationURL;
    this.clonedFacility.frameURL = formValues.frameURL;
    this.clonedFacility.address = formValues.address;
    this.clonedFacility.phone = formValues.phone;
    this.clonedFacility.city = formValues.city;
    this.clonedFacility.username = formValues.username;
    this.clonedFacility.password = formValues?.password;
    this.clonedFacility.pictureFile = formValues?.pictureFile;
    this.clonedFacility.name = formValues.name;
    this.clonedFacility.workingHours!.monday = new WorkingHours("PON", formValues.mondayOpeningTime!.getHours(), formValues.mondayOpeningTime!.getMinutes(), formValues.mondayClosingTime!.getHours(), formValues.mondayClosingTime!.getMinutes());
    this.clonedFacility.workingHours!.tuesday = new WorkingHours("UTO", formValues.tuesdayOpeningTime!.getHours(), formValues.tuesdayOpeningTime!.getMinutes(), formValues.tuesdayClosingTime!.getHours(), formValues.tuesdayClosingTime!.getMinutes());
    this.clonedFacility.workingHours!.wednesday = new WorkingHours("SRI", formValues.wednesdayOpeningTime!.getHours(), formValues.wednesdayOpeningTime!.getMinutes(), formValues.wednesdayClosingTime!.getHours(), formValues.wednesdayClosingTime!.getMinutes());
    this.clonedFacility.workingHours!.thursday = new WorkingHours("ČET", formValues.thursdayOpeningTime!.getHours(), formValues.thursdayOpeningTime!.getMinutes(), formValues.thursdayClosingTime!.getHours(), formValues.thursdayClosingTime!.getMinutes());
    this.clonedFacility.workingHours!.friday = new WorkingHours("PET", formValues.fridayOpeningTime!.getHours(), formValues.fridayOpeningTime!.getMinutes(), formValues.fridayClosingTime!.getHours(), formValues.fridayClosingTime!.getMinutes());
    this.clonedFacility.workingHours!.saturday = new WorkingHours("SUB", formValues.saturdayOpeningTime!.getHours(), formValues.saturdayOpeningTime!.getMinutes(), formValues.saturdayClosingTime!.getHours(), formValues.saturdayClosingTime!.getMinutes());
    this.clonedFacility.workingHours!.sunday = new WorkingHours("NED", formValues.sundayOpeningTime!.getHours(), formValues.sundayOpeningTime!.getMinutes(), formValues.sundayClosingTime!.getHours(), formValues.sundayClosingTime!.getMinutes());
  }
  updateFacility() {
    this.form2facility()

    this.submitted = true;
    this.facilityDialog = false;
    this.editMode = false;
    let facilityFormData: FormData = getFormData(this.clonedFacility);
    this.facilityForm.reset();
    this.facilityService.updateOwnFacility(this.clonedFacility._id, facilityFormData).subscribe({
      next: (updatedFacility) => {
        this.facility = updatedFacility;
        this.clonedFacility = {};
      },
      error: () => {
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

  modalHide() {
    this.facilityForm.reset();
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

      this.facilityForm.controls["pictureFile"].setValue(data.file);
    });
  }

}
