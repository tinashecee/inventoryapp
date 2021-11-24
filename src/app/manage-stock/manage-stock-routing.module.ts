import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageStockComponent } from './manage-stock.component';

const routes: Routes = [{
  path:'',
  component:ManageStockComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageStockRoutingModule { }
