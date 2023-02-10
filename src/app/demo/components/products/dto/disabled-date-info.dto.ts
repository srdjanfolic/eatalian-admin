import { DisabledUntilDate } from "./disabled-until-date.enum";

export class DisabledDateInfoDto {
   constructor(
    public until?: DisabledUntilDate,
    public value?: Date
   ) {}
}