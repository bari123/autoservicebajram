import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "../pages/login/login.component";
import {DashboardComponent} from "../pages/dashboard/dashboard/dashboard.component";
import {ClientsComponent} from "../pages/dashboard/clients/clients.component";
import {ClientsListComponent} from "../pages/dashboard/clients-list/clients-list.component";
import {CalendarComponent} from "../pages/dashboard/dashboard/calendar/calendar.component";
import {StorageComponent} from "../pages/dashboard/dashboard/storage/storage.component";
import {ClientCarInfoComponent} from "../pages/dashboard/clients/client-car-info/client-car-info.component";
import {AuthGuard} from "../pages/login/auth.guard";
import {InvoiceComponent} from "../pages/dashboard/dashboard/invoice/invoice.component";
import { StatisticsComponent } from 'src/pages/dashboard/dashboard/invoice/statistics/statistics.component';


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {
    path: 'dashboard',
    canActivate:[AuthGuard],
    component: DashboardComponent,
    children: [
      {path: 'clients-list', component: ClientsListComponent},
      {path: 'clients-list/:id', component: ClientsComponent},
      {path: 'clients-list/:id/car/:carId', component: ClientCarInfoComponent},
      {path:'calendar',component:CalendarComponent},
      {path:'storage',component:StorageComponent},
      {path:'invoice',component:InvoiceComponent},
      {path:'statistics',component:StatisticsComponent},
      {path: '', redirectTo: 'clients-list', pathMatch: 'full'},
    ]
  },
  {path: '', redirectTo: '/login', pathMatch: 'full'} // Redirect to login by default
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
