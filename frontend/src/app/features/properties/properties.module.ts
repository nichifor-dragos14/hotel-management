import { NgModule, inject } from '@angular/core';
import { PropertyService } from '$backend/services';
import { DeletePropertyComponent } from './delete-property.component';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterModule,
  Routes,
} from '@angular/router';
import { PropertiesPageComponent } from './properties-page/properties-page.component';
import { PropertyPageComponent } from './property-page/property-page.component';
import { DialogPageComponent } from '$shared/dialog-page';
import { NewPropertyPageComponent } from './new-property/new-property.component';
import { UpdatePropertyPageComponent } from './update-property/update-property.component';
import { EditPropertyFormFactory } from './update-property.form-builder';
import { PropertyReviewsPageComponent } from './property-reviews-page/property-reviews-page.component';
import { PropertyRoomsPageComponent } from './property-rooms-page/property-rooms-page.component';
import { PropertiesDummyComponent } from './properties.dummy.component';
import { AuthGuard } from '$features/auth/auth.guard';
import { LoginService } from '$features/auth/login.service';

const PROPERTY_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'reinit',
        component: PropertiesDummyComponent,
      },
      {
        path: 'admin',
        component: PropertiesPageComponent,
        canActivate: [AuthGuard],
        resolve: {
          _name: async ({ queryParams }: ActivatedRouteSnapshot) => {
            const router = inject(Router);

            try {
              return queryParams['location'];
            } catch (error) {
              router.navigate(['/error']);

              return null;
            }
          },
        },
        data: {
          role: ['Admin', 'Owner'],
        },
        children: [
          {
            path: 'new',
            component: NewPropertyPageComponent,
            runGuardsAndResolvers: 'always',
            resolve: {
              propertyTypes: async () => {
                const router = inject(Router);
                const propertyService = inject(PropertyService);

                try {
                  return await propertyService.propertiesTypesGetAsync();
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
          {
            path: ':id',
            component: UpdatePropertyPageComponent,
            runGuardsAndResolvers: 'always',
            resolve: {
              propertyForm: async ({ params }: ActivatedRouteSnapshot) => {
                const router = inject(Router);
                const loginService = inject(LoginService);
                const propertyService = inject(PropertyService);

                const editPropertyFormFactory = inject(EditPropertyFormFactory);

                try {
                  const property = await propertyService.propertiesIdGetAsync({
                    id: params['id'],
                  });

                  return editPropertyFormFactory.build({
                    description: property.description,
                    email: property.email,
                    hasBreakfast: property.hasBreakfast,
                    hasFitnessCenter: property.hasFitnessCenter,
                    hasFreeCancellation: property.hasFreeCancellation,
                    hasFreeWiFi: property.hasFreeWiFi,
                    hasKitchen: property.hasKitchen,
                    hasParking: property.hasParking,
                    hasPetFriendlyPolicy: property.hasPetFriendlyPolicy,
                    hasPool: property.hasPool,
                    hasRestaurant: property.hasRestaurant,
                    hasRoomService: property.hasRoomService,
                    id: property.id,
                    imageUrls: property.imageUrls.join(';'),
                    name: property.name,
                    phoneNumber: property.phoneNumber,
                    prepaymentNeeded: property.prepaymentNeeded,
                    rating: property.rating,
                    userId: loginService.getLoggedUserId(),
                  });
                } catch (error) {
                  router.navigate(['/error']);

                  return null;
                }
              },
            },
            canActivate: [AuthGuard],
            data: {
              role: ['Admin', 'Owner'],
            },
            children: [
              {
                path: 'actions',
                component: DialogPageComponent,
                children: [
                  {
                    path: 'delete',
                    component: DeletePropertyComponent,
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
                      role: ['Admin', 'Owner'],
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: ':id/preview',
        component: PropertyPageComponent,
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        data: {
          role: ['Client', ''],
        },
        resolve: {
          property: async ({ params, queryParams }: ActivatedRouteSnapshot) => {
            const router = inject(Router);
            const propertyService = inject(PropertyService);
            const loginService = inject(LoginService);

            try {
              return await propertyService.propertiesIdGetAsync({
                id: params['id'],
                startDate: queryParams['startDate'],
                endDate: queryParams['endDate'],
                numberOfAdults: queryParams['numberOfAdults'],
                numberOfChildren: queryParams['numberOfChildren'],
                loggedUserId: loginService.getLoggedUserId(),
              });
            } catch (error) {
              router.navigate(['/error']);

              return null;
            }
          },
        },
        children: [
          {
            path: 'view',
            component: DialogPageComponent,
            runGuardsAndResolvers: 'always',
            children: [
              {
                path: 'reviews',
                component: PropertyReviewsPageComponent,
                canActivate: [AuthGuard],
                data: {
                  role: ['Client', ''],
                },
              },
              {
                path: 'rooms',
                component: PropertyRoomsPageComponent,
                canActivate: [AuthGuard],
                data: {
                  role: ['Client', ''],
                },
              },
            ],
          },
        ],
      },
    ],
  },
] satisfies Routes;

@NgModule({
  imports: [RouterModule.forChild(PROPERTY_ROUTES)],
  exports: [RouterModule],
})
export class PropertiesModule {}
