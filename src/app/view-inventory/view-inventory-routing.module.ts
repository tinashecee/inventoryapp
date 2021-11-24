import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewInventoryComponent } from './view-inventory.component';

const routes: Routes = [{
  path: '',
  component: ViewInventoryComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewInventoryRoutingModule { }
