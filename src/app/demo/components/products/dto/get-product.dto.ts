export class GetProductDto {
    public _id?: string;
    public name?: string;
    public category?: string;
    public title?: string;
    public description?: string;
    public image?: string;
    public pictureFile?: File;
    public price?: number;
    public rating?: number;
    public isFeatured?: boolean;
}
