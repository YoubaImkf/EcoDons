import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeBodyComponent } from './components/home-body/home-body.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeBodyComponent },
  { path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
  { path: 'home', component: HomeBodyComponent, canActivate: [AuthGuard] }, 
  { path: 'items', loadChildren: () => import('./modules/items/items.module').then(m => m.ItemsModule) },
  { path: 'user', loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule) }, 
  { path: 'messaging', loadChildren: () => import('./modules/messaging/messaging.module').then(m => m.MessagingModule) },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
