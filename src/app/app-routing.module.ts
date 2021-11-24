import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [ {
  path: '',
  loadChildren: () => import('./homepage/homepage.module').then(m => m.HomepageModule)
},
{
  path: 'view-inventory',
  loadChildren: () => import('./view-inventory/view-inventory.module').then(m => m.ViewInventoryModule)
},
{  path: 'add-item',
loadChildren: () => import('./add-item/add-item-routing.module').then(m => m.AddItemRoutingModule)
},
{
path: 'remove-item',
loadChildren: () => import('./remove-item/remove-item-routing.module').then(m => m.RemoveItemRoutingModule)
},
{
  path: 'record',
loadChildren: () => import('./record/record-routing.module').then(m => m.RecordRoutingModule)
},
{
  path: 'report',
loadChildren: () => import('./report/report-routing.module').then(m => m.ReportRoutingModule)
},
{
  path: 'display',
loadChildren: () => import('./display/display-routing.module').then(m => m.DisplayRoutingModule)
},
{
  path: 'manage-stock',
loadChildren: () => import('./manage-stock/manage-stock.module').then(m => m.ManageStockModule)
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
