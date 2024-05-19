import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page-not-found">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <a routerLink="/">Go to Main page</a>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        min-height: 100vh;
      }

      .page-not-found {
        text-align: center;
        justify-self: center;
        align-content: center;
        width: 100%;
      }

      .page-not-found h1 {
        font-size: 3em;
        margin-bottom: 0.5em;
      }

      .page-not-found p {
        font-size: 1.5em;
        margin-bottom: 1em;
      }

      .page-not-found a {
        color: #007bff;
        text-decoration: none;
        font-size: 1.2em;
      }

      .page-not-found a:hover {
        text-decoration: underline;
      }
    `,
  ],
})
export class PageNotFoundComponent {}
