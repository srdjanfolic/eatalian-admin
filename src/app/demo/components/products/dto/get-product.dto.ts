import { GetCategoryListDto } from "../../categories/dto/get-category-list.dto";

export class GetProductDto {
    public _id?: string;
    public name?: string;
    public category?: GetCategoryListDto;
    public description?: string;
    public image?: string;
    public pictureFile?: File;
    public price?: number;
    public rating?: number;
    public isAddon?: boolean;
    public suggestedProducts?: GetProductDto[];
    public suggestedAddons?: GetProductDto[];
    public isFeatured?: boolean;
}
