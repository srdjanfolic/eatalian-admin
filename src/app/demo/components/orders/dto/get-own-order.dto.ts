import { GetFacilityDto } from "../../facilities/dto/get-facility-dto";

export class GetUserInfoDto {
    name?: string;
    phone?: string;
}

export enum OrderStatus {
    NEW = "NEW",
    PROGRESS = "PROGRESS",
    COMPLETED = "COMPLETED"
}

export class GetOwnOrderDto {
    _id?: string;
    address?: string;
    totalPrice?: number;
    dateCreated?: Date;
    facility?: GetFacilityDto;
    user?: GetUserInfoDto;
    status?: OrderStatus;
}