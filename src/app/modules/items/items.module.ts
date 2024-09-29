import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ItemsRoutingModule } from './items-routing.module';
import { ItemDetailsComponent } from './components/item-details/item-details.component';
import { CreateAdComponent } from './components/create-ad/create-ad.component';
import { MyAdsComponent } from './components/my-ads/my-ads.component';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';


@NgModule({
  declarations: [
    ItemDetailsComponent,
    CreateAdComponent,
    MyAdsComponent,
    ConfirmationModalComponent
  ],
  imports: [
    CommonModule,
    ItemsRoutingModule,
    ReactiveFormsModule,
    
  ]
})
export class ItemsModule { }
