import { NgModule, inject } from '@angular/core';
import { RoomService } from '$backend/services';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterModule,
  Routes,
} from '@angular/router';
import { RoomsPageComponent } from './rooms-page/rooms-page.component';
import { RoomsDummyComponent } from './rooms.dummy.component';
import { UpdateRoomPageComponent } from './update-room/update-room.component';
import { EditRoomFormFactory } from './update-room.form-builder';
import { NewRoomPageComponent } from './new-room/new-room.component';
import { DialogPageComponent } from '$shared/dialog-page';
import { DeleteRoomComponent } from './delete-room.component';
import { AuthGuard } from '$features/auth/auth.guard';

const ROOM_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'reinit/:id',
        component: RoomsDummyComponent,
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
          role: ['Admin'],
        },
      },
      {
        path: 'admin/property/:id',
        component: RoomsPageComponent,
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
          role: ['Admin'],
        },
        children: [
          {
            path: 'new',
            component: NewRoomPageComponent,
            resolve: {
              roomTypes: async () => {
                const router = inject(Router);
                const roomService = inject(RoomService);

                try {
                  return await roomService.roomsTypesGetAsync();
                } catch (error) {
                  router.navigate(['/error']);

                  return null;
                }
              },
            },
            canActivate: [AuthGuard],
            data: {
              role: ['Admin'],
            },
          },
          {
            path: ':id',
            component: UpdateRoomPageComponent,
            resolve: {
              roomForm: async ({ params }: ActivatedRouteSnapshot) => {
                const router = inject(Router);
                const roomService = inject(RoomService);

                const editPropertyFormFactory = inject(EditRoomFormFactory);

                try {
                  const room = await roomService.roomsIdGetAsync({
                    id: params['id'],
                  });

                  return editPropertyFormFactory.build(room);
                } catch (error) {
                  router.navigate(['/error']);

                  return null;
                }
              },
              roomDetails: async ({ params }: ActivatedRouteSnapshot) => {
                const router = inject(Router);
                const roomService = inject(RoomService);

                try {
                  const room = await roomService.roomsIdGetAsync({
                    id: params['id'],
                  });

                  return room;
                } catch (error) {
                  router.navigate(['/error']);

                  return null;
                }
              },
              propertyId: async ({ parent }: ActivatedRouteSnapshot) => {
                return parent?.params['id'];
              },
            },
            canActivate: [AuthGuard],
            data: {
              role: ['Admin'],
            },
            runGuardsAndResolvers: 'always',
            children: [
              {
                path: 'actions',
                component: DialogPageComponent,
                children: [
                  {
                    path: 'delete',
                    component: DeleteRoomComponent,
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
                      role: ['Admin'],
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
  imports: [RouterModule.forChild(ROOM_ROUTES)],
  exports: [RouterModule],
})
export class RoomsModule {}
