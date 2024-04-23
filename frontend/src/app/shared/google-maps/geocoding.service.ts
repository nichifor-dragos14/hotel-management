import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeocoderResponse } from './geocoder-response.model';

@Injectable({
  providedIn: 'root',
})
export class GeocodingService {
  http = inject(HttpClient);

  geocodeLatLng(
    location: google.maps.LatLngLiteral
  ): Promise<GeocoderResponse> {
    let geocoder = new google.maps.Geocoder();

    return new Promise((resolve, reject) => {
      geocoder.geocode({ location: location }, (results, status) => {
        const response: GeocoderResponse = {
          status: status,
          error_message: '',
          results: results!,
        };

        resolve(response);
      });
    });
  }

  getLocation(term: string): Observable<GeocoderResponse> {
    const url = `https://maps.google.com/maps/api/geocode/json?address=${term}&sensor=false&key=AIzaSyD4bjc5SxZJXzklu8-QTnSHI1HC8hU-pUA`;

    return this.http.get<GeocoderResponse>(url);
  }
}
