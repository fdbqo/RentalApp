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
        }
        return null;
    }

    private async findNearbyUniversities(lat: number, lng: number, radius = 5000): Promise<any[]> {
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=university&key=${this.GOOGLE_API_KEY}`;
        try {
            const { data } = await axios.get(url);
            return data.results?.filter(place =>
                place.types.includes("university") &&
                !place.name.toLowerCase().includes("academy") &&
                !place.name.toLowerCase().includes("sports") &&
                !place.name.toLowerCase().includes("school") &&
                place.user_ratings_total > 10
            ) || [];
        } catch (error) {
            console.error(`[ERROR] Google Places API failed: ${error.message}`);
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
        }
        return null;
    }

    private async computeClosestUniversityDistance(addressString: string): Promise<number | null> {
        const coords = await this.geocodeAddress(addressString);
        if (!coords) return null;

        const institutions = await this.findNearbyUniversities(coords.lat, coords.lng, 5000);
        if (!institutions.length) return null;

        const universities = institutions.filter(i => i.types.includes("university") && i.name.toLowerCase().includes("university"));
        const colleges = institutions.filter(i => i.types.includes("university") && !i.name.toLowerCase().includes("university"));

        const preferredInstitutions = universities.length ? universities : colleges;
        if (!preferredInstitutions.length) return null;

        const destinations = preferredInstitutions.map(i => ({
            lat: i.geometry.location.lat,
            lng: i.geometry.location.lng,
        }));

        const distanceMatrixData = await this.getDistanceMatrix(coords, destinations);
        if (!distanceMatrixData?.rows?.[0]?.elements) return null;

        let minDistance: number | null = null;
        let closestInstitution: any = null;

        distanceMatrixData.rows[0].elements.forEach((elem, index) => {
            if (elem.status === 'OK' && elem.distance?.value != null) {
                const distance = elem.distance.value;
                if (minDistance == null || distance < minDistance) {
                    minDistance = distance;
                    closestInstitution = preferredInstitutions[index];
                }
            }
        });

        return minDistance;
    }

    public async setDistanceFromUniversity(property: Property): Promise<Property> {
        if (!property?.houseAddress) {
            property.distanceFromUniversity = null;
            return property;
        }

        const addressString = this.formatAddressString(property.houseAddress);
        const distance = await this.computeClosestUniversityDistance(addressString);

        property.distanceFromUniversity = distance;
        return property;
    }
}
