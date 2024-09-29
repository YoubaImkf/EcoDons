import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemDetailsComponent } from './components/item-details/item-details.component';
import { CreateAdComponent } from './components/create-ad/create-ad.component';
import { MyAdsComponent } from './components/my-ads/my-ads.component';

const routes: Routes = [
  { path: 'create-ad', component: CreateAdComponent },   
  { path: 'my-ads', component: MyAdsComponent },         
  { path: ':id', component: ItemDetailsComponent },    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemsRoutingModule {}
