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
import {DateSliderComponent} from "../pages/dashboard/dashboard/calendar/date-slider/date-slider.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ToasterComponent} from "../pages/compo/toaster/toaster.component";
import {TruncatePipe} from "../utils/truncate.pipe";
import {TooltipDirective} from "../utils/tooltip.directive";
import {ButtonComponent} from "../components/button/button.component";
import {IconComponent} from "../components/icon/icon.component";
import {InvoiceComponent} from "../pages/dashboard/dashboard/invoice/invoice.component";
import {PrintLayoutComponent} from "../pages/dashboard/dashboard/print-layout/print-layout.component";
import {CdkTableModule} from "@angular/cdk/table";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {DragdropcompComponent} from "../components/dragdropcomp/dragdropcomp.component";
import {OverlayModule} from "@angular/cdk/overlay";
import {ToasterService} from "../pages/compo/toaster/toaster.service";
import {StatisticsComponent} from "../pages/dashboard/dashboard/invoice/statistics/statistics.component";
import {CanvasJSAngularChartsModule} from "@canvasjs/angular-charts";
import {NgOptimizedImage} from "@angular/common";
import {ModalComponent} from "../components/modal/modal.component";

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
    ClientCarInfoComponent,
    DateSliderComponent,
    ToasterComponent,
    TruncatePipe,
    TooltipDirective,
    ButtonComponent,
    IconComponent,
    InvoiceComponent,
    PrintLayoutComponent,
    DragdropcompComponent,
    StatisticsComponent,
    ModalComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        BrowserAnimationsModule,
        CdkTableModule,
        DragDropModule,
        OverlayModule,
        CanvasJSAngularChartsModule,
        NgOptimizedImage
    ],
  providers: [{
    provide:HTTP_INTERCEPTORS,
    useClass:CookieInterceptor,
    multi:true
  },ToasterService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
