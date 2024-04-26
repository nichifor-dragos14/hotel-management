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
        children: [
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
            },
            runGuardsAndResolvers: 'always',
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
