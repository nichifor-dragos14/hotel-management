import { NgModule, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule, Routes } from '@angular/router';
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
import { DeleteBookingComponent } from './delete-booking.component';
import { LeaveReviewComponent } from './leave-review.component';
import { LeaveReviewFormFactory } from './leave-review.form';
import { LeaveReportFormFactory } from './leave-report.form';
import { LeaveReportComponent } from './leave-report.component';

const BOOKING_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'reinit',
        component: BookingsDummyComponent,
      },
      {
        path: 'my-reservations',
        component: BookingsPageComponent,
        resolve: {
          userId: async () => {
            const loginService = inject(LoginService);

            return loginService.getLoggedUserId();
          },
        },
        children: [
          {
            path: ':id',
            component: UpdateBookingPageComponent,
            resolve: {
              bookingDetails: async ({ params }: ActivatedRouteSnapshot) =>
                await inject(BookingService).bookingsIdGetAsync({
                  id: params['id'],
                }),
              bookingForm: async ({ params }: ActivatedRouteSnapshot) => {
                const editBookingForm = inject(UpdateBookingFormFactory);

                let booking = await inject(BookingService).bookingsIdGetAsync({
                  id: params['id'],
                });

                return editBookingForm.build({
                  expectedArrival: booking.expectedArrival,
                  id: booking.id,
                  specialMentions: booking.specialMentions,
                });
              },
            },
            children: [
              {
                path: 'actions',
                component: DialogPageComponent,
                children: [
                  {
                    path: 'delete',
                    component: DeleteBookingComponent,
                    resolve: {
                      id: ({ parent }: ActivatedRouteSnapshot) =>
                        parent?.parent?.params['id'],
                    },
                  },
                  {
                    path: 'review/:id',
                    component: LeaveReviewComponent,
                    resolve: {
                      property: async ({ params }: ActivatedRouteSnapshot) =>
                        await inject(PropertyService).propertiesIdGetAsync({
                          id: params['id'],
                        }),
                      reviewForm: async ({
                        params,
                      }: ActivatedRouteSnapshot) => {
                        const leaveReviewFormFactory = inject(
                          LeaveReviewFormFactory
                        );
                        const loginService = inject(LoginService);
                        const propertyService = inject(PropertyService);

                        let userId = loginService.getLoggedUserId();

                        var property =
                          await propertyService.propertiesIdGetAsync({
                            id: params['id'],
                          });

                        return leaveReviewFormFactory.build({
                          description: '',
                          propertyId: property.id,
                          rating: 1,
                          title: '',
                          userId: userId,
                        });
                      },
                    },
                  },
                  {
                    path: 'report/:id',
                    component: LeaveReportComponent,
                    resolve: {
                      property: async ({ params }: ActivatedRouteSnapshot) =>
                        await inject(PropertyService).propertiesIdGetAsync({
                          id: params['id'],
                        }),
                      reportForm: async ({
                        params,
                      }: ActivatedRouteSnapshot) => {
                        const leaveReportFormFactory = inject(
                          LeaveReportFormFactory
                        );
                        const loginService = inject(LoginService);
                        const propertyService = inject(PropertyService);

                        let userId = loginService.getLoggedUserId();

                        var property =
                          await propertyService.propertiesIdGetAsync({
                            id: params['id'],
                          });

                        return leaveReportFormFactory.build({
                          description: '',
                          propertyId: property.id,
                          title: '',
                          userId: userId,
                        });
                      },
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
          property: async ({ queryParams }: ActivatedRouteSnapshot) =>
            await inject(PropertyService).propertiesIdGetAsync({
              id: queryParams['propertyId'],
            }),
          propertyRooms: async ({ queryParams }: ActivatedRouteSnapshot) =>
            await inject(RoomService).roomsIdsGetAsync({
              ids: queryParams['selectedRoomIds'].split(','),
            }),
          startDate: async ({ queryParams }: ActivatedRouteSnapshot) =>
            queryParams['startDate'],
          endDate: async ({ queryParams }: ActivatedRouteSnapshot) =>
            queryParams['endDate'],
          numberOfAdults: async ({ queryParams }: ActivatedRouteSnapshot) =>
            queryParams['numberOfAdults'],
          numberOfChildren: async ({ queryParams }: ActivatedRouteSnapshot) =>
            queryParams['numberOfChildren'],
          userForm: async () => {
            let userEmail = inject(LoginService).getLoggedUserEmail();

            const editUserDetailsFormFactory = inject(
              CreateBookingUserFormFactory
            );

            let user = await inject(UserService).usersEmailGetAsync({
              email: userEmail,
            });

            return editUserDetailsFormFactory.build({
              country: user.nationality,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              phoneNumber: user.phoneNumber,
            });
          },
          userId: async () => {
            const loginService = inject(LoginService);

            return loginService.getLoggedUserId();
          },
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
