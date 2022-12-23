export class WorkingHours {
    constructor(
        public shorthand: string,
        public openingHours: number,
        public openingMinutes: number,
        public closingHours: number,
        public closingMinutes: number
    ) {}
   
}

export class WorkingWeek {
    monday!: WorkingHours;
    tuesday!: WorkingHours;
    wednesday!: WorkingHours;
    thursday!: WorkingHours;
    friday!: WorkingHours;
    saturday!: WorkingHours;
    sunday!: WorkingHours;
}
