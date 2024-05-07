import {
  trigger,
  style,
  animate,
  transition,
  query,
  group,
} from '@angular/animations';

export const slideInAnimation = trigger('routeAnimations', [
  transition('RecommendationsPage <=> SearchPage', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          width: '100%',
          margin: 0,
          padding: 0,
          border: 'none',
        }),
      ],
      { optional: true }
    ),
    group([
      query(
        ':enter',
        [
          style({ left: '-100%' }),
          animate('300ms ease-out', style({ left: '0%' })),
        ],
        { optional: true }
      ),
      query(
        ':leave',
        [style({ opacity: 1 }), animate('0s', style({ opacity: 0 }))],
        { optional: true }
      ),
    ]),
  ]),
]);
