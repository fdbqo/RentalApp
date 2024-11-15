export class CreatePropertyDto {
  readonly name: string;
  readonly description: string;
  readonly images: string[];
  readonly availability: string;
  readonly propertyType: string;
  readonly rooms: number;
  readonly bathrooms: number;
  readonly distanceFromUniversity: number;
  readonly price: number;
}