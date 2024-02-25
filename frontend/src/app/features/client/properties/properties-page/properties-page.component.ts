import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-client-properties-page',
  templateUrl: './properties-page.component.html',
  styleUrls: ['./properties-page.component.scss'],
  imports: [],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertiesPageClientComponent {}
