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
        const parts = [
            address.addressLine1,
            address.addressLine2,
            address.townCity,
            address.county,
            address.eircode,
            // optionally add Ireland or another country if relevant, can be dynamic later
            'Ireland',
        ].filter(Boolean);

        return parts.join(', ');
    }

    // geocoding api for turning address into lat/lng
    private async geocodeAddress(addressString: string): Promise<{ lat: number; lng: number } | null> {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            addressString,
        )}&key=${this.GOOGLE_API_KEY}`;

        const { data } = await axios.get(url);
        if (data.results && data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry.location;
            return { lat, lng };
        }
        return null;
    }

    // find nearby universities from places API "nearbysearch" with type=university
    // returns an array of place results from Google.

    private async findNearbyUniversities(
        lat: number,
        lng: number,
        radius = 5000,
    ): Promise<any[]> {
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=university&key=${this.GOOGLE_API_KEY}`;

        const { data } = await axios.get(url);
        return data.results || [];
    }

    private async getDistanceMatrix(
        origin: { lat: number; lng: number },
        destinations: { lat: number; lng: number }[],
    ): Promise<any> {
        if (!destinations.length) {
            return null;
        }

        const destString = destinations
            .map((d) => `${d.lat},${d.lng}`)
            .join('|');

        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lng}&destinations=${destString}&key=${this.GOOGLE_API_KEY}`;
        const { data } = await axios.get(url);
        return data;
    }

    private async computeClosestUniversityDistance(addressString: string): Promise<number | null> {
        const coords = await this.geocodeAddress(addressString);
        if (!coords) {
            return null;
        }

        // find up to 20 universities within 5km (or another radius)
        const unis = await this.findNearbyUniversities(coords.lat, coords.lng, 5000);
        if (!unis.length) {
            return null;
        }


        const destinations = unis.map((u) => ({
            lat: u.geometry.location.lat,
            lng: u.geometry.location.lng,
        }));


        const distanceMatrixData = await this.getDistanceMatrix(coords, destinations);
        if (!distanceMatrixData?.rows?.[0]?.elements) {
            return null;
        }

        const elements = distanceMatrixData.rows[0].elements;
        let minDistance: number | null = null;

        elements.forEach((elem) => {
            if (elem.status === 'OK' && elem.distance?.value != null) {
                const d = elem.distance.value; // in meters
                if (minDistance == null || d < minDistance) {
                    minDistance = d;
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