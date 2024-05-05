import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from "../pages/login/login.component";
import {DashboardComponent} from "../pages/dashboard/dashboard/dashboard.component";
import {ClientsListComponent} from "../pages/dashboard/clients-list/clients-list.component";
import {ClientsComponent} from "../pages/dashboard/clients/clients.component";
import {FormsModule} from "@angular/forms";
import {ClientInfoComponent} from "../pages/dashboard/clients/client-info/client-info.component";
import {ClientsHistoryComponent} from "../pages/dashboard/clients/clients-history/clients-history.component";
import {ClientCarsComponent} from "../pages/dashboard/clients/client-cars/client-cars.component";
import {CalendarComponent} from "../pages/dashboard/dashboard/calendar/calendar.component";
import {StorageComponent} from "../pages/dashboard/dashboard/storage/storage.component";
import {ClientCarInfoComponent} from "../pages/dashboard/clients/client-car-info/client-car-info.component";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {CookieInterceptor} from "../interceptor";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    ClientsListComponent,
    ClientsComponent,
    ClientInfoComponent,
    ClientsHistoryComponent,
    ClientCarsComponent,
    CalendarComponent,
    StorageComponent,
    ClientCarInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [{
    provide:HTTP_INTERCEPTORS,
    useClass:CookieInterceptor,
    multi:true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
