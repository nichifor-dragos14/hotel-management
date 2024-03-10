import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { SEARCH_PROPERTY_FORM } from '../new-search-property.form';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateConverterModule } from '$shared/date-converter';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { AppPageHeaderComponent } from '$shared/page-header';

@Component({
  selector: 'app-main-page-properties',
  templateUrl: './main-page-properties.component.html',
  styleUrls: ['./main-page-properties.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
  imports: [
    RouterModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    DateConverterModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatListModule,
    AppPageHeaderComponent,
  ],
})
export class MainPagePropertiesComponent {
  readonly searchPropertyForm = inject(SEARCH_PROPERTY_FORM);

  search(newSearch: typeof this.searchPropertyForm.value) {
    console.log(newSearch);
  }
}
