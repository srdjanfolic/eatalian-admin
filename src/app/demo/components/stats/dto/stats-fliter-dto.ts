import { PredefinedInterval } from "./predefined-interval.enum";
import { TimeScale } from "./time-scale.enum";

export class StatsFilterDto {
    constructor(
        public startDate?:Date,
        public endDate?: Date,
        public predefinedInterval?: PredefinedInterval,
        public scale?: TimeScale,
        public facility_id?: string
    ) {}

}