import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllocationsComponent } from './allocations.component';

const routes: Routes = [{path:"",component:AllocationsComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllocationsRoutingModule { }
