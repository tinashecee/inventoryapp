import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RemoveItemModule } from './remove-item.module';

const routes: Routes = [{
  path:'',
  component:RemoveItemModule
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RemoveItemRoutingModule { }
