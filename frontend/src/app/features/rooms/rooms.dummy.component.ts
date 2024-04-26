import { Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  template: '',
})
export class RoomsDummyComponent implements OnInit {
  router = inject(Router);

  @Input() propertyId!: string;

  ngOnInit() {
    this.router.navigate(['/rooms/admin/property', this.propertyId]);
  }
}
