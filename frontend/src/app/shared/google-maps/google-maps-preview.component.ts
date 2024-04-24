import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  inject,
  AfterViewInit,
  ChangeDetectorRef,
  Input,
  OnChanges,
} from '@angular/core';
import {
  GoogleMap,
  GoogleMapsModule,
  MapInfoWindow,
} from '@angular/google-maps';
import { RouterModule } from '@angular/router';
import { GeocodingService } from './geocoding.service';
import { GeocoderResponse } from './geocoder-response.model';
import { AppToastService } from '$shared/toast';

@Component({
  selector: 'app-google-maps-preview',
  template: `
    <google-map
      [zoom]="mapZoom"
      [center]="mapCenter"
      [options]="mapOptions"
      [height]="height"
      [width]="width"
    >
      <map-marker
        #marker="mapMarker"
        [position]="mapCenter"
        [options]="markerOptions"
      >
      </map-marker>
      <map-info-window>{{ markerInfoContent }}</map-info-window>
    </google-map>
  `,
  styles: `
 
  `,
  standalone: true,
  imports: [GoogleMapsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoogleMapsPreviewComponent implements AfterViewInit, OnChanges {
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) infoWindow!: MapInfoWindow;

  @Input() address: string = '';
  @Input() height: number = 300;
  @Input() width: number = 450;

  ngAfterViewInit() {
    //this.findAddress();
  }

  ngOnChanges() {
    //this.findAddress();
  }

  geocodingService = inject(GeocodingService);
  toastrService = inject(AppToastService);
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

  locationCoords!: google.maps.LatLng;

  findAddress() {
    if (!this.address || this.address.length === 0) {
      return;
    }

    this.geocodingService
      .getLocation(this.address)
      .subscribe((response: GeocoderResponse) => {
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
          this.markerInfoContent = location.formatted_address;

          this.markerOptions = {
            draggable: true,
            animation: google.maps.Animation.DROP,
          };

          this.cdr.markForCheck();
        } else {
          this.toastrService.open(
            'There was an error fetching the google maps location',
            'error'
          );
        }
      });
  }
}
