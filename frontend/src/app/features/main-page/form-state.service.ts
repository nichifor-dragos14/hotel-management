import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { FILTER_PROPERTY_FORM } from './filter-property.form';

@Injectable({
  providedIn: 'root',
})
export class FormStateService {
  private filterForm: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.filterForm = inject(FILTER_PROPERTY_FORM) as FormGroup;

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateFormState();
      });

    this.updateFormState();
  }

  private updateFormState(): void {
    const url = this.router.url;
    const shouldDisableFilters = url.includes('/main/our-recommendations');

    Object.keys(this.filterForm.controls).forEach((key) => {
      const control = this.filterForm.get(key);
      if (shouldDisableFilters) {
        control?.disable();
        control?.reset();
      } else {
        control?.enable();
      }
    });
  }
}
