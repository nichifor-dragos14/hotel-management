import { NgModule, inject } from '@angular/core';
import { PropertyService } from '$backend/services';
import { DeletePropertyComponent } from './delete-property.component';
import { ActivatedRouteSnapshot, RouterModule, Routes } from '@angular/router';
import { PropertiesPageComponent } from './properties-page/properties-page.component';
import { PropertyPageComponent } from './property-page/property-page.component';
import { DialogPageComponent } from '$shared/dialog-page';
import { PropertyRoomsPageComponent } from './property-rooms/property-rooms-page.component';

const PROPERTY_ROUTES: Routes = [
  {
    path: '',
    component: PropertiesPageComponent,
    resolve: {
      properties: async () =>
        await inject(PropertyService).propertiesGetAsync(),
    },
    children: [
      {
        path: ':id',
        component: PropertyPageComponent,
        resolve: {
          property: ({ params }: ActivatedRouteSnapshot) =>
            inject(PropertyService).propertiesIdGetAsync({ id: params['id'] }),
        },
        runGuardsAndResolvers: 'always',
        children: [
          {
            path: 'actions',
            component: DialogPageComponent,
            children: [
              {
                path: 'delete',
                component: DeletePropertyComponent,
                resolve: {
                  id: ({ parent }: ActivatedRouteSnapshot) =>
                    parent?.parent?.params['id'],
                },
              },
            ],
          },
        ],
      },
      {
        path: ':id/rooms',
        component: PropertyRoomsPageComponent,
        resolve: {
          rooms: ({ params }: ActivatedRouteSnapshot) =>
            inject(PropertyService).propertiesIdRoomsGetAsync({
              id: params?.['id'],
            }),
        },
      },
    ],
  },
] satisfies Routes;

@NgModule({
  imports: [RouterModule.forChild(PROPERTY_ROUTES)],
  exports: [RouterModule],
})
export class AdminPropertyModule {}
