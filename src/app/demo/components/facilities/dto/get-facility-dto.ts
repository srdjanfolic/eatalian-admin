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
        username?: string;
        image?: string;
        pictureFile?: File;
        workingHours?: WorkingWeek;
}
