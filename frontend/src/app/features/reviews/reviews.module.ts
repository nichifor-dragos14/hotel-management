import { NgModule, inject } from '@angular/core';
import { ReviewsPageComponent } from './reviews-page/reviews-page.component';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterModule,
  Routes,
} from '@angular/router';
import { ReviewsDummyComponent } from './reviews.dummy.component';
import { LoginService } from '$features/auth/login.service';
import { UpdateReviewPageComponent } from './update-review/update-review.component';
import { ReviewService } from '$backend/services';
import { UpdateReviewFormFactory } from './update-review.form';
import { AuthGuard } from '$features/auth/auth.guard';
import { DialogPageComponent } from '$shared/dialog-page';
import { DeleteReviewComponent } from './delete-review.component';
import { AdminReviewsPageComponent } from './admin-reviews-page/admin-reviews-page.component';
import { ReviewPageComponent } from './review-page/review-page.component';

const REVIEW_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'reinit',
        component: ReviewsDummyComponent,
      },
      {
        path: 'admin/property/:id',
        component: AdminReviewsPageComponent,
        resolve: {
          propertyId: ({ params }: ActivatedRouteSnapshot) => {
            const router = inject(Router);

            if (params['id']) {
              return params['id'];
            }

            router.navigate(['/error']);
          },
        },
        canActivate: [AuthGuard],
        data: {
          role: ['Owner'],
        },
        children: [
          {
            path: ':id',
            component: ReviewPageComponent,
            resolve: {
              review: async ({ params }: ActivatedRouteSnapshot) => {
                const router = inject(Router);
                const reviewService = inject(ReviewService);

                try {
                  const review = await reviewService.reviewsIdGetAsync({
                    id: params['id'],
                  });

                  return review;
                } catch (error) {
                  router.navigate(['/error']);

                  return null;
                }
              },
            },
            canActivate: [AuthGuard],
            data: {
              role: ['Owner'],
            },
          },
        ],
      },
      {
        path: 'my-reviews',
        component: ReviewsPageComponent,
        resolve: {
          userId: () => {
            const router = inject(Router);
            const loginService = inject(LoginService);

            try {
              return loginService.getLoggedUserId();
            } catch (error) {
              router.navigate(['/error']);

              return null;
            }
          },
        },
        canActivate: [AuthGuard],
        data: {
          role: ['Client'],
        },
        children: [
          {
            path: ':id',
            component: UpdateReviewPageComponent,
            resolve: {
              reviewForm: async ({ params }: ActivatedRouteSnapshot) => {
                const router = inject(Router);
                const reviewService = inject(ReviewService);

                const updateReviewFormFactory = new UpdateReviewFormFactory();

                try {
                  const review = await reviewService.reviewsIdGetAsync({
                    id: params['id'],
                  });

                  return updateReviewFormFactory.build({
                    description: review.description,
                    id: review.id,
                    title: review.title,
                    rating: review.rating,
                  });
                } catch (error) {
                  router.navigate(['/error']);

                  return null;
                }
              },
            },
            canActivate: [AuthGuard],
            data: {
              role: ['Client'],
            },
            children: [
              {
                path: 'actions',
                component: DialogPageComponent,
                children: [
                  {
                    path: 'delete',
                    component: DeleteReviewComponent,
                    resolve: {
                      id: ({ parent }: ActivatedRouteSnapshot) => {
                        const router = inject(Router);

                        if (parent?.parent?.params['id']) {
                          return parent?.parent?.params['id'];
                        } else {
                          router.navigate(['/error']);
                        }
                      },
                    },
                    canActivate: [AuthGuard],
                    data: {
                      role: ['Client'],
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
] satisfies Routes;

@NgModule({
  imports: [RouterModule.forChild(REVIEW_ROUTES)],
  exports: [RouterModule],
})
export class ReviewsModule {}
