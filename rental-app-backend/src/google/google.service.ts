import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Property } from '../property/schemas/property.schema';

@Injectable()
export class DistanceService {
  private readonly GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  private readonly MAX_DESTINATIONS_PER_REQUEST = 25;

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
    ]
      .filter(Boolean)
      .join(', ');
  }

  private async geocodeAddress(
    addressString: string,
  ): Promise<{ lat: number; lng: number } | null> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      addressString,
    )}&key=${this.GOOGLE_API_KEY}`;

    try {
      const { data } = await axios.get(url);
      return data.results?.length ? data.results[0].geometry.location : null;
    } catch (error) {
      return null;
    }
  }

  private async fetchAllNearbyUniversities(
    lat: number,
    lng: number,
    radius = 30000,
  ): Promise<any[]> {
    const baseUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
    let url = `${baseUrl}?location=${lat},${lng}&radius=${radius}&type=university&key=${this.GOOGLE_API_KEY}`;

    let allResults: any[] = [];
    let nextPageToken: string | null = null;
    let pageCount = 0;

    do {
      const { data } = await axios.get(url);
      if (data.results) {
        allResults = allResults.concat(data.results);
      }
      nextPageToken = data.next_page_token || null;
      pageCount++;
      if (nextPageToken && pageCount < 3) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        url = `${baseUrl}?pagetoken=${nextPageToken}&key=${this.GOOGLE_API_KEY}`;
      } else {
        break;
      }
    } while (nextPageToken && pageCount < 3);

    return allResults;
  }


  private async fetchAllNameBasedUniversities(
    lat: number,
    lng: number,
    radius = 30000,
  ): Promise<any[]> {
    const baseUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
    let url = `${baseUrl}?location=${lat},${lng}&radius=${radius}&keyword=university|college|institute&key=${this.GOOGLE_API_KEY}`;

    let allResults: any[] = [];
    let nextPageToken: string | null = null;
    let pageCount = 0;

    do {
      const { data } = await axios.get(url);
      if (data.results) {
        allResults = allResults.concat(data.results);
      }
      nextPageToken = data.next_page_token || null;
      pageCount++;
      if (nextPageToken && pageCount < 3) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        url = `${baseUrl}?pagetoken=${nextPageToken}&key=${this.GOOGLE_API_KEY}`;
      } else {
        break;
      }
    } while (nextPageToken && pageCount < 3);

    return allResults;
  }

  private async batchDistanceMatrix(
    origin: { lat: number; lng: number },
    destinations: { lat: number; lng: number }[],
  ): Promise<any[]> {
    const batches = [];
    for (let i = 0; i < destinations.length; i += this.MAX_DESTINATIONS_PER_REQUEST) {
      batches.push(destinations.slice(i, i + this.MAX_DESTINATIONS_PER_REQUEST));
    }

    let allElements: any[] = [];
    for (const batch of batches) {
      const destString = batch.map(d => `${d.lat},${d.lng}`).join('|');
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lng}&destinations=${destString}&key=${this.GOOGLE_API_KEY}`;
      try {
        const { data } = await axios.get(url);
        if (data && data.rows && data.rows[0] && data.rows[0].elements) {
          allElements = allElements.concat(data.rows[0].elements);
        }
      } catch (error) {
        console.error(`[ERROR] Batch Distance Matrix API failed: ${error.message}`);
      }
    }
    return allElements;
  }

  public async getNearestUniversities(
    property: Property,
    limit = 5,
  ): Promise<any[]> {
    if (!property?.houseAddress) return [];

    const addressString = this.formatAddressString(property.houseAddress);

    const coords = await this.geocodeAddress(addressString);
    if (!coords) return [];

    let institutions = await this.fetchAllNearbyUniversities(coords.lat, coords.lng, 30000);
    if (!institutions.length) {
      institutions = await this.fetchAllNameBasedUniversities(coords.lat, coords.lng, 30000);
    }
    if (!institutions.length) return [];

    const destinations = institutions.map(i => ({
      lat: i.geometry.location.lat,
      lng: i.geometry.location.lng,
    }));

    const allDistanceElements = await this.batchDistanceMatrix(coords, destinations);
    if (!allDistanceElements || allDistanceElements.length === 0) {
      console.error(`[ERROR] Distance Matrix API returned no valid elements. Defaulting distances to 0.`);
    }

    const combined = institutions.map((inst, index) => {
      const elem = allDistanceElements[index];
      return {
        place: inst,
        distanceValue:
          elem && elem.status === 'OK' && elem.distance?.value != null
            ? elem.distance.value
            : 0,
      };
    });

    const filterByReviews = (threshold: number) =>
      combined.filter(item => {
        const types: string[] = item.place.types || [];
        const name = item.place.name.toLowerCase();
        const isUniversity = types.includes('university') || name.includes('university');
        const isCollege = types.includes('college') || name.includes('college');
        const isLikelySecondary =
          (types.includes('school') || types.includes('secondary_school')) &&
          !isUniversity &&
          !isCollege;
        return !isLikelySecondary && (item.place.user_ratings_total || 0) >= threshold;
      });

    let validInstitutions = filterByReviews(50);
    if (validInstitutions.length === 0) {
      validInstitutions = filterByReviews(25);
    }
    if (validInstitutions.length === 0) {
      validInstitutions = filterByReviews(10);
    }

    validInstitutions.sort((a, b) => {
      const scoreA = (a.place.rating || 0) * (a.place.user_ratings_total || 0);
      const scoreB = (b.place.rating || 0) * (b.place.user_ratings_total || 0);
      return scoreB - scoreA;
    });

    const topN = validInstitutions.slice(0, limit);

    const results = topN.map(item => {
      const minDistance = item.distanceValue || 0;
      const avgTimeByCar = Math.ceil((minDistance / 1000) * 1.5);
      return {
        name: item.place.name,
        address: {
          addressLine1: item.place.vicinity || item.place.name,
          townCity: property.houseAddress.townCity,
          county: property.houseAddress.county,
          eircode: property.houseAddress.eircode,
        },
        distance: minDistance,
        avgTimeByCar,
        rating: item.place.rating || null,
        totalReviews: item.place.user_ratings_total || null,
      };
    });

    return results;
  }
}
