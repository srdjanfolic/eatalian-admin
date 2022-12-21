export class WorkingHours {
    shorthand?: string;
    openingHours?: number;
    openingMinutes?: number;
    closingHours?: number;
    closingMinutes?: number;
}

export class WorkingWeek {
    monday?: WorkingHours;
    tuesday?: WorkingHours;
    wednesday?: WorkingHours;
    thursday?: WorkingHours;
    friday?: WorkingHours;
    saturday?: WorkingHours;
    sunday?: WorkingHours;
}
