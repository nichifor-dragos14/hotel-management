import { NgModule } from '@angular/core';
import { ReviewsPageComponent } from './reviews-page/reviews-page.component';
import { RouterModule, Routes } from '@angular/router';
import { ReviewsDummyComponent } from './reviews.dummy.component';

const REVIEW_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'reinit',
        component: ReviewsDummyComponent,
      },
      {
        path: 'my-reviews',
        component: ReviewsPageComponent,
        children: [],
      },
    ],
  },
] satisfies Routes;

@NgModule({
  imports: [RouterModule.forChild(REVIEW_ROUTES)],
  exports: [RouterModule],
})
export class ReviewsModule {}
