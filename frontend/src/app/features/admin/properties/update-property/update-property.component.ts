import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-update-property-page',
  templateUrl: './update-property.component.html',
  styleUrls: ['./update-property.component.scss'],
  imports: [RouterModule, MatIconModule, MatButtonModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePropertyPageComponent {}
