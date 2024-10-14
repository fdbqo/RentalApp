export class CreatePropertyDto {
  readonly name: string;
  readonly price: number;
  readonly image: string;
  readonly availability: string;
  readonly description: string;
  readonly propertyType: string;
  readonly rooms: number;
  readonly bathrooms: number;
  readonly distanceFromUniversity: number;
}