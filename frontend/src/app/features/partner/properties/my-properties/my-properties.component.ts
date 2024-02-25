import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-my-properties-page',
  templateUrl: './my-properties.component.html',
  styleUrls: ['./my-properties.component.scss'],
  imports: [],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyPropertiesPagePartnerComponent {}
