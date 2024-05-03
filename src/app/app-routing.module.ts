import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "../pages/login/login.component";
import {DashboardComponent} from "../pages/dashboard/dashboard/dashboard.component";
import {ClientsComponent} from "../pages/dashboard/clients/clients.component";
import {ClientsListComponent} from "../pages/dashboard/clients-list/clients-list.component";
import {CalendarComponent} from "../pages/dashboard/dashboard/calendar/calendar.component";


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {path: 'clients-list', component: ClientsListComponent},
      {path: 'clients-list/:id', component: ClientsComponent},
      {path:'calendar',component:CalendarComponent},
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
