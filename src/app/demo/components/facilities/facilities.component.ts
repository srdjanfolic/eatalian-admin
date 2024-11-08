import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { Subscription } from 'rxjs';
import { GetFacilityDto } from './dto/get-facility-dto';
import { FacilitiesService } from './facilities.service';
import { ConfirmationService, Message, SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { DeleteManyFacilitiesDto } from './dto/delete-many-facilities.dto';
import { getFormData, noWhitespaceValidator } from '../../shared/sharedFunctions';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgxPhotoEditorService } from 'ngx-photo-editor';
import { ValidateFn } from 'mongoose';
import { FacilityTypesService } from '../facility-types/facility-types.service';
import { GetFacilityTypeDto } from '../facility-types/dto/get-facility-type.dto';
import { PaymentMethodType } from '../../shared/dto/payment-method-type.enum';
import { SafeResourceUrl } from '@angular/platform-browser';
import { DisabledUntilDate } from '../../shared/dto/disabled-until-date.enum';
import { DatePipe } from '@angular/common';
import { WorkingHours } from './dto/working-hours.dto';
import { CreateFacilityDto } from './dto/create-facility.dto';


@Component({
  selector: 'app-facilities',
  templateUrl: './facilities.component.html',
  styleUrls: ['./facilities.component.scss']
})
export class FacilitiesComponent implements OnInit, OnDestroy {


  disabledDateOptions!: SelectItem[];
  disabledDateInfo: DisabledUntilDate | null = null;
  disabledDate: Date | null = null;

  customDate: boolean = false;

  facilities: GetFacilityDto[] = [];
  facilityTypes: GetFacilityTypeDto[] = [];
  selectedFacilities: GetFacilityDto[] = [];

  facility!: GetFacilityDto;
  clonedFacility!: GetFacilityDto;

  facilityDialog!: boolean;
  submitted!: boolean;
  editMode: boolean = false;
  facilityForm!: FormGroup;
  paymentMethodType = PaymentMethodType;
  previewImage?: SafeResourceUrl;

  private getFacilitiesSubscription!: Subscription;
  private getFacilityTypesSubscription!: Subscription;

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

  messages?: Message[];

  constructor(
    private facilityService: FacilitiesService,
    private facilityTypesService: FacilityTypesService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private ngxPhotoEditorService: NgxPhotoEditorService
  ) { }


  setDefaultHours() {

    this.mondayOpeningTime = new Date();
    this.mondayOpeningTime.setHours(9, 0, 0, 0);
    this.mondayClosingTime = new Date();
    this.mondayClosingTime.setHours(22, 0, 0, 0);

    this.tuesdayOpeningTime = new Date();
    this.tuesdayOpeningTime.setHours(8, 0, 0, 0);
    this.tuesdayClosingTime = new Date();
    this.tuesdayClosingTime.setHours(22, 0, 0, 0);

    this.wednesdayOpeningTime = new Date();
    this.wednesdayOpeningTime.setHours(8, 0, 0, 0);
    this.wednesdayClosingTime = new Date();
    this.wednesdayClosingTime.setHours(22, 0, 0, 0);

    this.thursdayOpeningTime = new Date();
    this.thursdayOpeningTime.setHours(8, 0, 0, 0);
    this.thursdayClosingTime = new Date();
    this.thursdayClosingTime.setHours(22, 0, 0, 0);

    this.fridayOpeningTime = new Date();
    this.fridayOpeningTime.setHours(8, 0, 0, 0);
    this.fridayClosingTime = new Date();
    this.fridayClosingTime.setHours(22, 0, 0, 0);

    this.saturdayOpeningTime = new Date();
    this.saturdayOpeningTime.setHours(8, 0, 0, 0);
    this.saturdayClosingTime = new Date();
    this.saturdayClosingTime.setHours(22, 0, 0, 0);

    this.sundayOpeningTime = new Date();
    this.sundayOpeningTime.setHours(0, 0, 0, 0);
    this.sundayClosingTime = new Date();
    this.sundayClosingTime.setHours(0, 0, 0, 0);

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

    this.setDefaultHours();


    this.getFacilitiesSubscription = this.facilityService.getFacilities().subscribe(
      (facilities: GetFacilityDto[]) => {
        this.facilities = facilities;
      }
    );
    this.getFacilityTypesSubscription = this.facilityTypesService.getFacilityTypes().subscribe(
      (facilityTypes: GetFacilityTypeDto[]) => {
        this.facilityTypes = facilityTypes;
      }
    );
    this.disabledDateOptions = [
      { label: DisabledUntilDate.FOR_1_HOUR, value: DisabledUntilDate.FOR_1_HOUR },
      { label: DisabledUntilDate.END_OF_DAY, value: DisabledUntilDate.END_OF_DAY },
      { label: DisabledUntilDate.ALWAYS, value: DisabledUntilDate.ALWAYS },
      { label: DisabledUntilDate.ENABLED, value: DisabledUntilDate.ENABLED },
      { label: DisabledUntilDate.CUSTOM, value: DisabledUntilDate.CUSTOM },
    ];

    this.facilityForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required as ValidatorFn,
        noWhitespaceValidator as ValidatorFn,
      ]),
      title: new FormControl(null, [
        Validators.required as ValidatorFn,
        noWhitespaceValidator as ValidatorFn,
      ]),
      description: new FormControl(null, [
        Validators.required as ValidatorFn,
        noWhitespaceValidator as ValidatorFn,
      ]),
      facilityType: new FormControl(null, []),
      fee: new FormControl(0, [
        Validators.required as ValidatorFn
      ]),
      additionalMinimum: new FormControl(null, [
        Validators.required as ValidatorFn,
      ]),
      additionalFee: new FormControl(null, [
        Validators.required as ValidatorFn,
      ]),
      locationURL: new FormControl(null, []),
      frameURL: new FormControl(null, []),
      polygon: new FormControl(null, [
        Validators.required as ValidatorFn,
        noWhitespaceValidator as ValidatorFn,
      ]),
      city: new FormControl(null, [
        Validators.required as ValidatorFn,
        noWhitespaceValidator as ValidatorFn,
      ]),
      address: new FormControl(null, [
        Validators.required as ValidatorFn,
        noWhitespaceValidator as ValidatorFn,
      ]),
      phone: new FormControl(null, [
        Validators.required as ValidatorFn,
        noWhitespaceValidator as ValidatorFn,
      ]),
      username: new FormControl(null, [
        Validators.required as ValidatorFn,
        noWhitespaceValidator as ValidatorFn,
      ]),
      password: new FormControl(null, [
        Validators.required as ValidatorFn,
        noWhitespaceValidator as ValidatorFn,
      ]),
      pictureFile: new FormControl(null),
      closedUntil: new FormControl(null),
      mondayOpeningTime: new FormControl(this.mondayOpeningTime, [
        Validators.required as ValidatorFn,
        noWhitespaceValidator as ValidatorFn,
      ]),
      mondayClosingTime: new FormControl(this.mondayClosingTime, [
        Validators.required as ValidatorFn,
        noWhitespaceValidator as ValidatorFn,
      ]),
      tuesdayOpeningTime: new FormControl(this.tuesdayOpeningTime, [
        Validators.required as ValidatorFn,
        noWhitespaceValidator as ValidatorFn,
      ]),
      tuesdayClosingTime: new FormControl(this.tuesdayClosingTime, [
        Validators.required as ValidatorFn,
        noWhitespaceValidator as ValidatorFn,
      ]),
      wednesdayOpeningTime: new FormControl(this.wednesdayOpeningTime, [
        Validators.required as ValidatorFn,
        noWhitespaceValidator as ValidatorFn,
      ]),
      wednesdayClosingTime: new FormControl(this.wednesdayClosingTime, [
        Validators.required as ValidatorFn,
        noWhitespaceValidator as ValidatorFn,
      ]),
      thursdayOpeningTime: new FormControl(this.thursdayOpeningTime, [
        Validators.required as ValidatorFn,
        noWhitespaceValidator as ValidatorFn,
      ]),
      thursdayClosingTime: new FormControl(this.thursdayClosingTime, [
        Validators.required as ValidatorFn,
        noWhitespaceValidator as ValidatorFn,
      ]),
      fridayOpeningTime: new FormControl(this.fridayOpeningTime, [
        Validators.required as ValidatorFn,
        noWhitespaceValidator as ValidatorFn,
      ]),
      fridayClosingTime: new FormControl(this.fridayClosingTime, [
        Validators.required as ValidatorFn,
        noWhitespaceValidator as ValidatorFn,
      ]),
      saturdayOpeningTime: new FormControl(this.saturdayOpeningTime, [
        Validators.required as ValidatorFn,
        noWhitespaceValidator as ValidatorFn,
      ]),
      saturdayClosingTime: new FormControl(this.saturdayClosingTime, [
        Validators.required as ValidatorFn,
        noWhitespaceValidator as ValidatorFn,
      ]),
      sundayOpeningTime: new FormControl(this.sundayOpeningTime, [
        Validators.required as ValidatorFn,
        noWhitespaceValidator as ValidatorFn,
      ]),
      sundayClosingTime: new FormControl(this.sundayClosingTime, [
        Validators.required as ValidatorFn,
        noWhitespaceValidator as ValidatorFn,
      ]),
      deliveryTimeFrom: new FormControl(null, [
        Validators.required as ValidatorFn,
        noWhitespaceValidator as ValidatorFn,
      ]),
      deliveryTimeTo: new FormControl(null, [
        Validators.required as ValidatorFn,
        noWhitespaceValidator as ValidatorFn,
      ]),

      deleted: new FormControl(null),
      selectedPaymentTypes: new FormControl<PaymentMethodType[] | null>([], [Validators.required]),
      sortIndex: new FormControl(1000),
    },
      { validators: [this.validDeliveryTime] });
  }


  validDeliveryTime(control: AbstractControl): ValidationErrors | null {

    const from = control.get("deliveryTimeFrom")?.value;
    const to = control.get("deliveryTimeTo")?.value;
    if (from > to)
      return { 'invalidInterval': true };
    return null;
  }
  ngOnDestroy(): void {
    this.getFacilitiesSubscription.unsubscribe();
    this.getFacilityTypesSubscription.unsubscribe();
  }

  modalHide() {
    this.facilityForm.reset();
    this.disabledDateInfo = null;
    this.disabledDate = null;
  }

  onDisabledChange() {

    this.customDate = this.disabledDateInfo === DisabledUntilDate.CUSTOM;

  }

  form2facility() {



    let formValues = this.facilityForm.getRawValue();
    this.clonedFacility['name'] = formValues.name;
    this.clonedFacility['title'] = formValues.title;
    this.clonedFacility['description'] = formValues.description;
    this.clonedFacility['facilityType'] = formValues.facilityType;
    this.clonedFacility['fee'] = formValues.fee;
    this.clonedFacility['additional'] = { 'minimum': formValues.additionalMinimum, 'fee': formValues.additionalFee },
    this.clonedFacility['locationURL'] = formValues.locationURL;
    this.clonedFacility['frameURL'] = formValues.frameURL;
    this.clonedFacility['polygon'] = formValues.polygon;
    this.clonedFacility['city'] = formValues.city;
    this.clonedFacility['address'] = formValues.address;
    this.clonedFacility['phone'] = formValues.phone;
    this.clonedFacility['username'] = formValues.username;
    this.clonedFacility['password'] = formValues?.password;
    this.clonedFacility['pictureFile'] = formValues?.pictureFile;
    this.clonedFacility['deliveryTime'] = { 'from': formValues.deliveryTimeFrom, 'to': formValues.deliveryTimeTo };
    this.clonedFacility['closedUntil'] = { 'until': this.disabledDateInfo, 'value': this.disabledDate };
    this.clonedFacility['deleted'] = formValues.deleted;
    this.clonedFacility['selectedPaymentTypes'] = formValues.selectedPaymentTypes;
    this.clonedFacility['sortIndex'] = formValues.sortIndex;
    
    this.clonedFacility['workingHours'] = {
      monday : new WorkingHours("PON", formValues.mondayOpeningTime!.getHours(), formValues.mondayOpeningTime!.getMinutes(), formValues.mondayClosingTime!.getHours(), formValues.mondayClosingTime!.getMinutes()),
      tuesday : new WorkingHours("UTO", formValues.tuesdayOpeningTime!.getHours(), formValues.tuesdayOpeningTime!.getMinutes(), formValues.tuesdayClosingTime!.getHours(), formValues.tuesdayClosingTime!.getMinutes()),
      wednesday : new WorkingHours("SRI", formValues.wednesdayOpeningTime!.getHours(), formValues.wednesdayOpeningTime!.getMinutes(), formValues.wednesdayClosingTime!.getHours(), formValues.wednesdayClosingTime!.getMinutes()),
      thursday : new WorkingHours("ČET", formValues.thursdayOpeningTime!.getHours(), formValues.thursdayOpeningTime!.getMinutes(), formValues.thursdayClosingTime!.getHours(), formValues.thursdayClosingTime!.getMinutes()),
      friday : new WorkingHours("PET", formValues.fridayOpeningTime!.getHours(), formValues.fridayOpeningTime!.getMinutes(), formValues.fridayClosingTime!.getHours(), formValues.fridayClosingTime!.getMinutes()),
      saturday : new WorkingHours("SUB", formValues.saturdayOpeningTime!.getHours(), formValues.saturdayOpeningTime!.getMinutes(), formValues.saturdayClosingTime!.getHours(), formValues.saturdayClosingTime!.getMinutes()),
      sunday : new WorkingHours("NED", formValues.sundayOpeningTime!.getHours(), formValues.sundayOpeningTime!.getMinutes(), formValues.sundayClosingTime!.getHours(), formValues.sundayClosingTime!.getMinutes())
    }

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
    this.previewImage = undefined;
    this.clonedFacility = new GetFacilityDto();
    this.facility = {};
    this.editMode = false;
    this.submitted = false;
    this.facilityDialog = true;
    this.facilityForm.get('password')?.addValidators([Validators.required as ValidatorFn, noWhitespaceValidator as ValidatorFn]);
  }

  hideDialog() {
    this.facilityDialog = false;
    this.facilityForm.reset();
    this.disabledDateInfo = null;
    this.disabledDate = null;
    this.submitted = false;
  }

  editFacility(facility: GetFacilityDto) {
    this.editMode = true;
    this.facility = facility;
    this.clonedFacility = facility
    this.setHours();
    console.log(typeof facility.closedUntil, facility.closedUntil)
    if (facility.closed && facility.closedUntil) {
      let detail = new DatePipe('en-US').transform(facility.closedUntil, 'YYYY') == '2222' ? `Zatvoreno` : `Zatvoreno do ${new DatePipe('en-US').transform(facility.closedUntil, 'dd.MM.YYYY HH:mm')}h`
      this.messages = [{ severity: 'error', detail: detail },]
    }
    this.previewImage = facility.image;
    this.submitted = false;
    this.facilityDialog = true;
    this.facilityForm.patchValue(
      {
        "name": facility.name,
        "title": facility.title,
        "description": facility.description,
        "facilityType": facility.facilityType,
        "fee": facility.fee,
        "locationURL": facility.locationURL,
        "frameURL": facility.frameURL,
        "phone": facility.phone,
        "address": facility.address,
        "city": facility.city,
        "polygon": facility.polygon,
        "username": facility.username,
        "deleted": facility.deleted,
        "selectedPaymentTypes": facility.selectedPaymentTypes,
        "sortIndex": facility.sortIndex,
        "additionalMinimum": facility.additional?.minimum,
        "additionalFee": facility.additional?.fee,
        "deliveryTimeFrom": this.facility.deliveryTime?.from,
        "deliveryTimeTo": this.facility.deliveryTime?.to,
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

  test() {
    this.form2facility();
    let facilityFormData: FormData = getFormData(this.clonedFacility);
    console.log(facilityFormData, this.clonedFacility)
  }

  saveFacility() {

    this.submitted = true;
    this.form2facility();
    let facilityFormData: FormData = getFormData(this.clonedFacility);

    this.facilityService.createFacility(facilityFormData).subscribe({
      next: (createdFacility) => {
        this.facility = {};
        this.facilityDialog = false;
        this.facilities.push(createdFacility);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Facility created!', life: 5000 });
        this.facilityForm.reset();
        this.disabledDateInfo = null;
        this.disabledDate = null;
      },
      error: () => {
        this.facility = {};
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error creating facility', life: 5000 });
        //this.facilityForm.reset();
        this.disabledDateInfo = null;
        this.disabledDate = null;
      }
    });
  }

  updateFacility() {


    this.submitted = true;
    this.facilityDialog = false;
    this.editMode = false;
    this.form2facility();
    let facilityFormData: FormData = getFormData(this.clonedFacility);

    this.facilityService.updateFacility(this.facility._id, facilityFormData).subscribe({
      next: (updatedFacility) => {
        const index = this.facilities.indexOf(this.facility);
        this.facilities[index] = updatedFacility;
        this.facility = {};
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Facility updated!', life: 3000 });
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
      this.previewImage = data.base64!;
      this.facilityForm.controls["pictureFile"].setValue(data.file);
    });
  }
  beforeUpload($event: any, fileUpload: any) {
    //const file = $event.currentFiles[0];
    console.log("Zartvoren");
  }

}
