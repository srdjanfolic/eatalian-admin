import { DeliveryTime } from "./delivery-time.dto";
import { WorkingWeek } from "./working-hours.dto";

export class GetFacilityDto {
        _id?: string;
        password?:string;
        name?: string;
        address?: string;
        city?: string;
        phone?: string;
        title?: string;
        description?: string;
        facilityType?: string;
        frameURL?: string;
        locationURL?: string;
        username?: string;
        image?: string;
        pictureFile?: File;
        workingHours?: WorkingWeek;
        deliveryTime?: DeliveryTime;
        closed?: boolean;
        deleted?: boolean;
}
