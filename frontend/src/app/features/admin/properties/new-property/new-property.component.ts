import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-new-property-page',
  templateUrl: './new-property.component.html',
  styleUrls: ['./new-property.component.scss'],
  imports: [],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewPropertyPageComponent {}
