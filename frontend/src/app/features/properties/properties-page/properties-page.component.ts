import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AppPageHeaderComponent } from '$shared/page-header';
import { PropertyService } from '$backend/services';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { PaginatedDataSource } from '$core/pagination';
import { AppLinePlaceholderComponent } from '$shared/placeholders/line-placeholder';
import { AppCirclePlaceholderComponent } from '$shared/placeholders/circle-placeholder';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'app-properties-page',
  templateUrl: './properties-page.component.html',
  styleUrls: ['./properties-page.component.scss'],
  imports: [
    RouterModule,
    MatButtonModule,
    AppPageHeaderComponent,
    ScrollingModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatBadgeModule,
    AppLinePlaceholderComponent,
    AppCirclePlaceholderComponent,
    FormsModule,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertiesPageComponent {
  readonly propertyService = inject(PropertyService);
  readonly router = inject(Router);

  private nameSubject = new Subject<string>();
  private subscription: Subscription = new Subscription();

  @Input()
  private _name!: string;

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
    this.nameSubject.next(value);
  }

  propertiesDataSource = new PaginatedDataSource({
    fetch: ({ from, to }) =>
      this.propertyService.propertiesGet({
        from,
        to,
        name: this._name,
      }),
  });

  ngOnInit() {
    this.subscription.add(
      this.nameSubject.pipe(debounceTime(500)).subscribe((name) => {
        this.onLocationChange(name);
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async onLocationChange(location: string) {
    if (location) {
      await this.router.navigate(['/properties/reinit'], {
        queryParams: { location: location },
      });
    } else {
      await this.router.navigate(['/properties/reinit']);
    }
  }
}
