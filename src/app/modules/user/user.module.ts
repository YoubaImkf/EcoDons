import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [FavoritesComponent, EditProfileComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule
  ]
})
export class UserModule { }
