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

  messages?: Message[];

  constructor(
    private facilityService: FacilitiesService,
    private facilityTypesService: FacilityTypesService,
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
    this.clonedFacility['additional'] = {'minimum': formValues.additionalMinimum, 'fee': formValues.additionalFee},
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
    /*
    this.clonedFacility.workingHours!.monday = new WorkingHours("PON", formValues.mondayOpeningTime!.getHours(), formValues.mondayOpeningTime!.getMinutes(), formValues.mondayClosingTime!.getHours(), formValues.mondayClosingTime!.getMinutes());
    this.clonedFacility.workingHours!.tuesday = new WorkingHours("UTO", formValues.tuesdayOpeningTime!.getHours(), formValues.tuesdayOpeningTime!.getMinutes(), formValues.tuesdayClosingTime!.getHours(), formValues.tuesdayClosingTime!.getMinutes());
    this.clonedFacility.workingHours!.wednesday = new WorkingHours("SRI", formValues.wednesdayOpeningTime!.getHours(), formValues.wednesdayOpeningTime!.getMinutes(), formValues.wednesdayClosingTime!.getHours(), formValues.wednesdayClosingTime!.getMinutes());
    this.clonedFacility.workingHours!.thursday = new WorkingHours("ČET", formValues.thursdayOpeningTime!.getHours(), formValues.thursdayOpeningTime!.getMinutes(), formValues.thursdayClosingTime!.getHours(), formValues.thursdayClosingTime!.getMinutes());
    this.clonedFacility.workingHours!.friday = new WorkingHours("PET", formValues.fridayOpeningTime!.getHours(), formValues.fridayOpeningTime!.getMinutes(), formValues.fridayClosingTime!.getHours(), formValues.fridayClosingTime!.getMinutes());
    this.clonedFacility.workingHours!.saturday = new WorkingHours("SUB", formValues.saturdayOpeningTime!.getHours(), formValues.saturdayOpeningTime!.getMinutes(), formValues.saturdayClosingTime!.getHours(), formValues.saturdayClosingTime!.getMinutes());
    this.clonedFacility.workingHours!.sunday = new WorkingHours("NED", formValues.sundayOpeningTime!.getHours(), formValues.sundayOpeningTime!.getMinutes(), formValues.sundayClosingTime!.getHours(), formValues.sundayClosingTime!.getMinutes());
    */
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
    this.clonedFacility = new GetFacilityDto();
    this.form2facility();
    let facilityFormData: FormData = getFormData(this.clonedFacility);

    this.facilityService.createFacility(facilityFormData).subscribe({
      next: (createdFacility) => {
        this.facility = {};
        this.facilities.push(createdFacility);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Facility created!', life: 5000 });
        this.facilityForm.reset();
        this.disabledDateInfo = null;
        this.disabledDate = null;
      },
      error: () => {
        this.facility = {};
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error creating facility', life: 5000 });
        this.facilityForm.reset();
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
