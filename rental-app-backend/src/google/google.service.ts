import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Property } from '../property/schemas/property.schema';

@Injectable()
export class DistanceService {
    private readonly GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

    private formatAddressString(address: {
        addressLine1: string;
        addressLine2?: string;
        townCity: string;
        county: string;
        eircode: string;
    }): string {
        return [
            address.addressLine1,
            address.addressLine2,
            address.townCity,
            address.county,
            address.eircode,
            'Ireland',
        ].filter(Boolean).join(', ');
    }

    private async geocodeAddress(addressString: string): Promise<{ lat: number; lng: number } | null> {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addressString)}&key=${this.GOOGLE_API_KEY}`;

        try {
            const { data } = await axios.get(url);
            return data.results?.length ? data.results[0].geometry.location : null;
        } catch (error) {
            console.error(`[ERROR] Geocode API failed: ${error.message}`);
            return null;
        }
    }

    private async findNearbyUniversities(lat: number, lng: number, radius = 15000): Promise<any[]> {
        
        console.log(radius);
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=university&key=${this.GOOGLE_API_KEY}`;
        console.log(url);

        try {
            const { data } = await axios.get(url);
            if (!data.results) return [];

            const universities = data.results.filter(place =>
                place.types.includes("university") &&
                place.name.toLowerCase().includes("university")
            );

            return universities.length ? universities : data.results.filter(place => place.types.includes("university"));
        } catch (error) {
            console.error(`[ERROR] Places API failed: ${error.message}`);
            return [];
        }
    }

    private async getDistanceMatrix(origin: { lat: number; lng: number }, destinations: { lat: number; lng: number }[]): Promise<any> {
        if (!destinations.length) return null;

        const destString = destinations.map(d => `${d.lat},${d.lng}`).join('|');
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lng}&destinations=${destString}&key=${this.GOOGLE_API_KEY}`;

        try {
            const { data } = await axios.get(url);
            return data;
        } catch (error) {
            console.error(`[ERROR] Distance Matrix API failed: ${error.message}`);
            return null;
        }
    }





    public async getNearestUniversityDetails(property: Property): Promise<any> {
        if (!property?.houseAddress) return null;

        const addressString = this.formatAddressString(property.houseAddress);
        const coords = await this.geocodeAddress(addressString);
        if (!coords) return null;

        const institutions = await this.findNearbyUniversities(coords.lat, coords.lng, 15000);
        if (!institutions.length) return null;

        const destinations = institutions.map(i => ({
            lat: i.geometry.location.lat,
            lng: i.geometry.location.lng,
        }));

        const distanceMatrixData = await this.getDistanceMatrix(coords, destinations);
        if (!distanceMatrixData?.rows?.[0]?.elements) return null;

        let closestInstitution: any = null;
        let minDistance: number | null = null;

        distanceMatrixData.rows[0].elements.forEach((elem, index) => {
            if (elem.status === 'OK' && elem.distance?.value != null) {
                if (minDistance == null || elem.distance.value < minDistance) {
                    minDistance = elem.distance.value;
                    closestInstitution = institutions[index];
                }
            }
        });

        if (!closestInstitution) return null;

        const avgTimeByCar = Math.ceil((minDistance || 0) / 1000 * 1.5);

        return {
            name: closestInstitution.name,
            address: {
                addressLine1: closestInstitution.vicinity || closestInstitution.name,
                townCity: property.houseAddress.townCity,
                county: property.houseAddress.county,
                eircode: property.houseAddress.eircode,
            },
            distance: minDistance || 0,
            avgTimeByCar,
        };
    }
}
