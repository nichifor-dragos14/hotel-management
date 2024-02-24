import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  template: `
    <h1>{{ title }}</h1>
    <ng-content select="[button]"></ng-content>
  `,
  styles: `
      :host {
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-align: center;
          margin-bottom: 16px;
      }

      h1 {
          margin: 0;
      }
    `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AppPageHeaderComponent {
  @Input() title: string = '';
}
