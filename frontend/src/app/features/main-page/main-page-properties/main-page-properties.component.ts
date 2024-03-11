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
import { PropertyCardComponent } from '$shared/cards';
import { PropertyService, PropertySummaryFiltered } from '$backend/services';
import { PaginatedDataSource } from '$core/pagination';
import { of } from 'rxjs';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AppLinePlaceholderComponent } from '$shared/placeholders/line-placeholder';
import { AppCirclePlaceholderComponent } from '$shared/placeholders/circle-placeholder';

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
    PropertyCardComponent,
    ScrollingModule,
    AppLinePlaceholderComponent,
    AppCirclePlaceholderComponent,
  ],
})
export class MainPagePropertiesComponent {
  readonly searchPropertyForm = inject(SEARCH_PROPERTY_FORM);
  propertyService = inject(PropertyService);

  propertiesDataSource = new PaginatedDataSource<PropertySummaryFiltered>({
    fetch: ({ from, to }) => {
      return of({ results: [], totalCount: 0 });
    },
  });

  search(newSearch: typeof this.searchPropertyForm.value) {
    const {
      location,
      startDate,
      endDate,
      numberOfAdults,
      numberOfChildren,
      numberOfRooms,
    } = newSearch;

    if (
      !location ||
      !startDate ||
      !endDate ||
      numberOfAdults === undefined ||
      numberOfChildren === undefined ||
      numberOfRooms === undefined
    ) {
      return;
    }

    this.propertiesDataSource = new PaginatedDataSource({
      fetch: ({ from, to }) => {
        return this.propertyService.propertiesFilterLocationStartDateEndDateNumberOfAdultsNumberOfChildrenNumberOfRoomsGet(
          {
            from,
            to,
            location,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            numberOfAdults,
            numberOfChildren,
            numberOfRooms,
          }
        );
      },
    });

    console.log(this.propertiesDataSource);
  }
}
