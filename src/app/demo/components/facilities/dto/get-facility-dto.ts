import { PaymentMethodType } from "src/app/demo/shared/dto/payment-method-type.enum";
import { DeliveryTime } from "./delivery-time.dto";
import { WorkingWeek } from "./working-hours.dto";
import { Additional } from "./additional.dto";

export class GetFacilityDto {
        _id?: string;
        password?:string;
        name?: string;
        address?: string;
        city?: string;
        polygon?: string;
        phone?: string;
        title?: string;
        description?: string;
        facilityType?: string;
        fee?: number;
        frameURL?: string;
        locationURL?: string;
        username?: string;
        image?: string;
        pictureFile?: File;
        workingHours?: WorkingWeek;
        nonWorkingDates?: Date[];
        deliveryTime?: DeliveryTime;
        additional?: Additional;
        closed?: boolean;
        deleted?: boolean;
        selectedPaymentTypes?: PaymentMethodType[];
        sortIndex?: number;
}
