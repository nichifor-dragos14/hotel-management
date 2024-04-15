import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  template: '',
})
export class ReportsDummyComponent implements OnInit {
  router = inject(Router);

  ngOnInit() {
    this.router.navigate(['/reports/admin']);
  }
}
