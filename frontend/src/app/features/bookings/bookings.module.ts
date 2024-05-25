import { NgModule, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterModule,
  Routes,
} from '@angular/router';
import { NewBookingPageComponent } from './new-booking/new-booking.component';
import {
  BookingService,
  PropertyService,
  RoomService,
  UserService,
} from '$backend/services';
import { LoginService } from '$features/auth/login.service';
import { CreateBookingUserFormFactory } from './new-booking-form';
import { BookingsPageComponent } from './bookings-page/bookings-page.component';
import { UpdateBookingPageComponent } from './update-booking/update-booking.component';
import { UpdateBookingFormFactory } from './update-booking.form';
import { BookingsDummyComponent } from './bookings.dummy.component';
import { DialogPageComponent } from '$shared/dialog-page';
import { CancelBookingComponent } from './cancel-booking.component';
import { LeaveReviewComponent } from './leave-review.component';
import { LeaveReviewFormFactory } from './leave-review.form';
import { LeaveReportFormFactory } from './leave-report.form';
import { LeaveReportComponent } from './leave-report.component';
import { AuthGuard } from '$features/auth/auth.guard';
import { AdminBookingsPageComponent } from './admin-bookings-page/admin-bookings-page.component';
import { BookingPageComponent } from './booking-page/booking-page.component';

const BOOKING_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'reinit',
        component: BookingsDummyComponent,
      },
      {
        path: 'admin/property/:id',
        component: AdminBookingsPageComponent,
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
            component: BookingPageComponent,
            resolve: {
              booking: async ({ params }: ActivatedRouteSnapshot) => {
                const router = inject(Router);
                const bookingService = inject(BookingService);

                try {
                  const booking = await bookingService.bookingsIdAdminGetAsync({
                    id: params['id'],
                  });

                  return booking;
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
        path: 'my-reservations',
        component: BookingsPageComponent,
        resolve: {
          userId: async () => {
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
            component: UpdateBookingPageComponent,
            runGuardsAndResolvers: 'always',
            resolve: {
              bookingDetails: async ({ params }: ActivatedRouteSnapshot) => {
                const router = inject(Router);
                const bookingService = inject(BookingService);

                try {
                  return await bookingService.bookingsIdGetAsync({
                    id: params['id'],
                  });
                } catch (error) {
                  router.navigate(['/error']);

                  return null;
                }
              },
              bookingForm: async ({ params }: ActivatedRouteSnapshot) => {
                const router = inject(Router);
                const editBookingForm = inject(UpdateBookingFormFactory);
                const bookingService = inject(BookingService);

                try {
                  const booking = await bookingService.bookingsIdGetAsync({
                    id: params['id'],
                  });

                  return editBookingForm.build({
                    expectedArrival: booking.expectedArrival,
                    id: booking.id,
                    specialMentions: booking.specialMentions,
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
                    path: 'cancel',
                    component: CancelBookingComponent,
                    resolve: {
                      id: ({ parent }: ActivatedRouteSnapshot) =>
                        parent?.parent?.params['id'],
                    },
                    canActivate: [AuthGuard],
                    data: {
                      role: ['Client'],
                    },
                  },
                  {
                    path: 'review/:id',
                    component: LeaveReviewComponent,
                    resolve: {
                      property: async ({ params }: ActivatedRouteSnapshot) => {
                        const router = inject(Router);
                        const propertyService = inject(PropertyService);

                        try {
                          return await propertyService.propertiesIdGetAsync({
                            id: params['id'],
                          });
                        } catch (error) {
                          router.navigate(['/error']);

                          return null;
                        }
                      },
                      reviewForm: async ({
                        params,
                        parent,
                      }: ActivatedRouteSnapshot) => {
                        const router = inject(Router);
                        const loginService = inject(LoginService);
                        const propertyService = inject(PropertyService);

                        const leaveReviewFormFactory = inject(
                          LeaveReviewFormFactory
                        );

                        try {
                          const userId = loginService.getLoggedUserId();

                          const property =
                            await propertyService.propertiesIdGetAsync({
                              id: params['id'],
                            });

                          return leaveReviewFormFactory.build({
                            description: '',
                            propertyId: property.id,
                            rating: 5,
                            title: '',
                            userId: userId,
                            bookingId: parent?.parent?.params['id'],
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
                  },
                  {
                    path: 'report/:id',
                    component: LeaveReportComponent,
                    resolve: {
                      property: async ({ params }: ActivatedRouteSnapshot) => {
                        const router = inject(Router);
                        const propertyService = inject(PropertyService);

                        try {
                          return await propertyService.propertiesIdGetAsync({
                            id: params['id'],
                          });
                        } catch (error) {
                          router.navigate(['/error']);

                          return null;
                        }
                      },
                      reportForm: async ({
                        params,
                        parent,
                      }: ActivatedRouteSnapshot) => {
                        const router = inject(Router);
                        const loginService = inject(LoginService);
                        const propertyService = inject(PropertyService);

                        const leaveReportFormFactory = inject(
                          LeaveReportFormFactory
                        );

                        try {
                          const userId = loginService.getLoggedUserId();

                          const property =
                            await propertyService.propertiesIdGetAsync({
                              id: params['id'],
                            });

                          return leaveReportFormFactory.build({
                            description: '',
                            propertyId: property.id,
                            title: '',
                            userId: userId,
                            bookingId: parent?.parent?.params['id'],
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
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: 'new',
        component: NewBookingPageComponent,
        resolve: {
          property: async ({ queryParams }: ActivatedRouteSnapshot) => {
            const router = inject(Router);

            try {
              return await inject(PropertyService).propertiesIdGetAsync({
                id: queryParams['propertyId'],
              });
            } catch (error) {
              router.navigate(['/error']);

              return null;
            }
          },
          propertyRooms: async ({ queryParams }: ActivatedRouteSnapshot) => {
            const router = inject(Router);

            try {
              return await inject(RoomService).roomsIdsGetAsync({
                ids: queryParams['selectedRoomIds'].split(','),
              });
            } catch (error) {
              router.navigate(['/error']);

              return null;
            }
          },
          startDate: async ({ queryParams }: ActivatedRouteSnapshot) => {
            const router = inject(Router);

            if (queryParams['startDate']) {
              const today = new Date().setHours(0, 0, 0, 0);

              if (
                new Date(queryParams['startDate']).setHours(0, 0, 0, 0) < today
              ) {
                router.navigate(['/error']);

                return null;
              }

              return queryParams['startDate'];
            } else {
              router.navigate(['/error']);

              return null;
            }
          },

          endDate: async ({ queryParams }: ActivatedRouteSnapshot) => {
            const router = inject(Router);

            if (queryParams['endDate']) {
              const today = new Date().setHours(0, 0, 0, 0);
              const tomorrow = new Date(today);
              tomorrow.setDate(tomorrow.getDate() + 1);

              if (
                new Date(queryParams['endDate']).setHours(0, 0, 0, 0) <
                tomorrow.setHours(0, 0, 0, 0)
              ) {
                router.navigate(['/error']);

                return null;
              }

              return queryParams['endDate'];
            } else {
              router.navigate(['/error']);

              return null;
            }
          },

          userForm: async () => {
            const router = inject(Router);
            const loginService = inject(LoginService);
            const userService = inject(UserService);

            const editUserDetailsFormFactory = inject(
              CreateBookingUserFormFactory
            );

            try {
              const userEmail = loginService.getLoggedUserEmail();

              const user = await userService.usersEmailGetAsync({
                email: userEmail,
              });

              return editUserDetailsFormFactory.build({
                country: user.nationality,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
              });
            } catch (error) {
              router.navigate(['/error']);

              return null;
            }
          },
          user: async () => {
            const router = inject(Router);
            const loginService = inject(LoginService);
            const userService = inject(UserService);

            try {
              const userEmail = loginService.getLoggedUserEmail();

              return userService.usersEmailGetAsync({
                email: userEmail,
              });
            } catch (error) {
              router.navigate(['error']);

              return null;
            }
          },
          discount: async ({ queryParams }: ActivatedRouteSnapshot) => {
            const router = inject(Router);
            const loginService = inject(LoginService);
            const propertyService = inject(PropertyService);

            try {
              const userId = loginService.getLoggedUserId();

              return propertyService.propertiesDiscountGetAsync({
                loggedUserId: userId,
                propertyId: queryParams['propertyId'],
              });
            } catch (error) {
              router.navigate(['error']);

              return null;
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
] satisfies Routes;

@NgModule({
  imports: [RouterModule.forChild(BOOKING_ROUTES)],
  exports: [RouterModule],
})
export class BookingsModule {}
