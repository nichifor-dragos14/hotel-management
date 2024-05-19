import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  template: '',
})
export class PropertiesDummyComponent implements OnInit {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    this.router.navigate(['/properties/admin'], {
      queryParams: this.activatedRoute.snapshot.queryParams,
    });
  }
}
