import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  template: '',
})
export class BookingsDummyComponent implements OnInit {
  router = inject(Router);

  ngOnInit() {
    this.router.navigate(['/bookings/my-reservations']);
  }
}
