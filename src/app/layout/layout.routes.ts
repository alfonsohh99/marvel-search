import { Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'list',
        loadChildren: () =>
          import('../character-list/charecter-list.routes').then(
            (r) => r.routes
          ),
      },

      {
        path: '**',
        redirectTo: 'list',
      },
    ],
  },
];
