import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GoogleMap,
  GoogleMapsModule,
  MapInfoWindow,
  MapMarker,
} from '@angular/google-maps';
import { RouterModule } from '@angular/router';
import { GeocodingService } from './geocoding.service';
import { GeocoderResponse } from './geocoder-response.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AppToastService } from '$shared/toast';

@Component({
  selector: 'app-google-maps',
  template: `
    <mat-form-field appearance="outline">
      <input
        matInput
        [(ngModel)]="address"
        (keydown.enter)="findAddress()"
        placeholder="Enter your address here"
        [disabled]="isWorking"
      />
    </mat-form-field>

    <button
      mat-button
      (click)="findAddress()"
      [disabled]="isWorking || !address?.length"
    >
      Find address
    </button>

    <hr />

    <h5>Formatted Address</h5>
    <p>
      {{ formattedAddress?.length ? formattedAddress : 'N/A' }}
    </p>
    <h5>Coordinates</h5>
    <p class="mb-0">
      Latitude: {{ locationCoords?.lat() }}<br />
      Longitude: {{ locationCoords?.lng() }}
    </p>

    <google-map [zoom]="mapZoom" [center]="mapCenter" [options]="mapOptions">
      <map-marker
        #marker="mapMarker"
        [position]="mapCenter"
        [options]="markerOptions"
        (mapClick)="openInfoWindow(marker)"
        (mapDragend)="onMapDragEnd($event)"
      >
      </map-marker>
      <map-info-window>{{ markerInfoContent }}</map-info-window>
    </google-map>
  `,
  styles: `
 
  `,
  standalone: true,
  imports: [
    GoogleMapsModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoogleMapsComponent {
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) infoWindow!: MapInfoWindow;

  geocodingService = inject(GeocodingService);
  toastService = inject(AppToastService);
  cdr = inject(ChangeDetectorRef);

  mapZoom = 8;
  mapCenter!: google.maps.LatLng;
  mapOptions: google.maps.MapOptions = {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 20,
    minZoom: 4,
  };

  markerInfoContent = '';
  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
    animation: google.maps.Animation.DROP,
  };

  geocoderWorking = false;

  address!: string;
  formattedAddress!: string;
  locationCoords!: google.maps.LatLng;

  get isWorking(): boolean {
    return this.geocoderWorking;
  }

  openInfoWindow(marker: MapMarker) {
    this.infoWindow.open(marker);
  }

  findAddress() {
    if (!this.address || this.address.length === 0) {
      return;
    }

    this.geocoderWorking = true;
    this.geocodingService.getLocation(this.address).subscribe(
      (response: GeocoderResponse) => {
        if (response.status === 'OK' && response.results?.length) {
          const location = response.results[0];
          const loc: any = location.geometry.location;

          this.locationCoords = new google.maps.LatLng(loc.lat, loc.lng);

          this.mapCenter = location.geometry.location;

          setTimeout(() => {
            if (this.map !== undefined) {
              this.map.panTo(location.geometry.location);
            }
          }, 500);

          this.address = location.formatted_address;
          this.formattedAddress = location.formatted_address;
          this.markerInfoContent = location.formatted_address;

          this.markerOptions = {
            draggable: true,
            animation: google.maps.Animation.DROP,
          };

          this.cdr.markForCheck();
        } else {
          // error
        }
      },
      (err) => {
        console.error(err);
      }
    );

    this.geocoderWorking = false;
  }

  onMapDragEnd(event: google.maps.MapMouseEvent) {
    console.log('dragEnd');
    const point: google.maps.LatLngLiteral = {
      lat: event.latLng!.lat(),
      lng: event.latLng!.lng(),
    };

    this.geocoderWorking = true;
    this.geocodingService
      .geocodeLatLng(point)
      .then((response: GeocoderResponse) => {
        if (response.status === 'OK') {
          if (response.results.length) {
            const value = response.results[0];

            this.locationCoords = new google.maps.LatLng(point);

            this.mapCenter = new google.maps.LatLng(point);
            this.map.panTo(point);

            this.address = value.formatted_address;
            this.formattedAddress = value.formatted_address;

            this.markerOptions = {
              draggable: true,
              animation: google.maps.Animation.DROP,
            };

            this.markerInfoContent = value.formatted_address;
          }
        }
      })
      .finally(() => {
        this.geocoderWorking = false;
        this.cdr.markForCheck();
      });
  }
}
