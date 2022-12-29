
export class UpdateSuggestedProductsDto {
  constructor(
    private suggestedProducts?: string[],
    private suggestedAddons?: string[]
  ) {}
}
