import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "./guard/auth.guard";
import { AuthService } from './services/auth.service';
const routes: Routes = [
{
  path: 'report',
  canActivate: [AuthGuard],
  loadChildren: () => import('./homepage/homepage.module').then(m => m.HomepageModule)
},
{ path: '', redirectTo: '/sign-in', pathMatch: 'full' },
{
  path: 'view-inventory',
  canActivate: [AuthGuard],
  loadChildren: () => import('./view-inventory/view-inventory.module').then(m => m.ViewInventoryModule)
},
{  path: 'dashboard',
  canActivate: [AuthGuard],
loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
},
{  path: 'add-item',
  canActivate: [AuthGuard],
loadChildren: () => import('./add-item/add-item-routing.module').then(m => m.AddItemRoutingModule)
},
{
path: 'remove-item',
  canActivate: [AuthGuard],
loadChildren: () => import('./remove-item/remove-item-routing.module').then(m => m.RemoveItemRoutingModule)
},
{
  path: 'record',
  canActivate: [AuthGuard],
loadChildren: () => import('./record/record-routing.module').then(m => m.RecordRoutingModule)
},
{
  path: 'allocations',
  canActivate: [AuthGuard],
loadChildren: () => import('./report/report-routing.module').then(m => m.ReportRoutingModule)
},
{
  path: 'display',
   canActivate: [AuthGuard],
loadChildren: () => import('./display/display-routing.module').then(m => m.DisplayRoutingModule)
},
{
  path: 'manage-stock',
   canActivate: [AuthGuard],
loadChildren: () => import('./manage-stock/manage-stock.module').then(m => m.ManageStockModule)
}
,
{
  path: 'list-items',
   canActivate: [AuthGuard],
loadChildren: () => import('./list-items/list-items.module').then(m => m.ListItemsModule)
},
{
  path: 'forgot-password',
loadChildren: () => import('./forgot-password/forgot-password-routing.module').then(m => m.ForgotPasswordRoutingModule)
},
{
  path: 'sign-in',
loadChildren: () => import('./sign-in/sign-in.module').then(m => m.SignInModule)
}
,
{
  path: 'sign-up',
loadChildren: () => import('./sign-up/sign-up.module').then(m => m.SignUpModule)
},
{
  path: 'verify-email',
loadChildren: () => import('./verify-email/verify-email.module').then(m => m.VerifyEmailModule)
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
