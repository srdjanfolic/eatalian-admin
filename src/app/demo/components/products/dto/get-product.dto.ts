import { GetCategoryListDto } from "../../categories/dto/get-category-list.dto";
import { Unit } from "./unit.enum";

export class GetProductDto {
    public _id?: string;
    public name?: string;
    public category?: GetCategoryListDto;
    public description?: string;
    public image?: string;
    public pictureFile?: File;
    public rating?: number;
    public price?: number;
    public unit?: Unit;
    public isAddon?: boolean;
    public suggestedProducts?: GetProductDto[];
    public suggestedAddons?: GetProductDto[];
    public searchTags?: string[];
    public isFeatured?: boolean;
    public disabled?: boolean;
    public invisible?: boolean;
    public sortIndex?: number;
}
