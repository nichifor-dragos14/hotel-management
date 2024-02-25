import { NgModule, inject } from '@angular/core';
import { PropertyService } from '$backend/services';
import { DeletePropertyComponent } from './delete-property.component';
import { ActivatedRouteSnapshot, RouterModule, Routes } from '@angular/router';
import { PropertiesPageComponent } from './properties-page/properties-page.component';
import { PropertyPageComponent } from './property-page/property-page.component';
import { DialogPageComponent } from '$shared/dialog-page';
import { NewPropertyPageComponent } from './new-property/new-property.component';
import { UpdatePropertyPageComponent } from './update-property/update-property.component';

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
        path: 'new',
        component: NewPropertyPageComponent,
      },
      {
        path: ':id',
        component: UpdatePropertyPageComponent,
        resolve: {
          property: ({ params }: ActivatedRouteSnapshot) =>
            inject(PropertyService).propertiesIdGetAsync({ id: params['id'] }),
        },
        runGuardsAndResolvers: 'always',
        children: [
          {
            path: 'preview',
            component: PropertyPageComponent,
          },
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
    ],
  },
] satisfies Routes;

@NgModule({
  imports: [RouterModule.forChild(PROPERTY_ROUTES)],
  exports: [RouterModule],
})
export class AdminPropertyModule {}
