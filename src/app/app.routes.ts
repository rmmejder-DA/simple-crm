import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { UserComponent } from './user/user';
import { UserDetail } from './user-detail/user-detail';

export const routes: Routes = [
    { path: 'dashboard', component: Dashboard },
    { path: 'user', component: UserComponent },
    { path: 'user/:id', component: UserDetail }
];
