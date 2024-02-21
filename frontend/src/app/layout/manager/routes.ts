import { Route } from '@angular/router';
import { ManagerComponent } from './manager.component';
import { ServiceComponent } from './service/service.component';

export const ADMIN_ROUTES: Route[] = [
  {
    path: '', component: ManagerComponent,
    children: [
      {
        path: 'services',
        component: ServiceComponent
      }
    ]
  },
]
