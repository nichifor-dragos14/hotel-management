import { NgModule, inject } from '@angular/core';
import { PropertyService } from '$backend/services';
import { DeletePropertyComponent } from './delete-property.component';
import { ActivatedRouteSnapshot, RouterModule, Routes } from '@angular/router';
import { PropertiesPageComponent } from './properties-page/properties-page.component';
import { PropertyPageComponent } from './property-page/property-page.component';
import { DialogPageComponent } from '$shared/dialog-page';
import { NewPropertyPageComponent } from './new-property/new-property.component';
import { UpdatePropertyPageComponent } from './update-property/update-property.component';
import { EditPropertyFormFactory } from './update-property.form-builder';

const PROPERTY_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'admin',
        component: PropertiesPageComponent,
        children: [
          {
            path: 'new',
            component: NewPropertyPageComponent,
            resolve: {
              propertyTypes: async () =>
                await inject(PropertyService).propertiesTypesGetAsync(),
            },
          },
          {
            path: ':id',
            component: UpdatePropertyPageComponent,
            resolve: {
              propertyForm: async ({ params }: ActivatedRouteSnapshot) => {
                const editPropertyFormFactory = inject(EditPropertyFormFactory);

                const property = await inject(
                  PropertyService
                ).propertiesIdGetAsync({
                  id: params['id'],
                });

                return editPropertyFormFactory.build(property);
              },
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
        ],
      },
      {
        path: ':id/preview',
        component: PropertyPageComponent,
        resolve: {
          property: async ({ params }: ActivatedRouteSnapshot) =>
            await inject(PropertyService).propertiesIdGetAsync({
              id: params['id'],
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
export class PropertiesModule {}
