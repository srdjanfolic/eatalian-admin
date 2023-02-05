import { FilterMetadata } from "primeng/api";

export class GetOwnOrderFilterDto {
    constructor(
        private skip?: number,
        private limit?: number,
        private filters?: FilterMetadata
    ) {
    }
  
}