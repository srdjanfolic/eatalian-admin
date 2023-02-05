import { GetOwnOrderDto } from "./get-own-order.dto";

export class GetOwnOrderListDto {
    constructor(
        public orders: GetOwnOrderDto[],
        public ordersCount: number,
        public ordersTotal: number,
    ) {}
}