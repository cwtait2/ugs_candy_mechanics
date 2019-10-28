import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularWebStorageModule } from 'angular-web-storage';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ConnectComponent } from './components/connect/connect.component';
import { SelectFileComponent } from './components/select-file/select-file.component';
import { LoadChocolateComponent } from './components/load-chocolate/load-chocolate.component';
import { ChocolatePrintingComponent } from './components/chocolate-printing/chocolate-printing.component';
import { ChocolateFinishedComponent } from './components/chocolate-finished/chocolate-finished.component';
import { StaffComponent } from './components/staff/staff.component';
import { StartPrintingComponent } from './components/start-printing/start-printing.component';
import { FooterComponent } from './components/footer/footer.component';
import { HasSelectedFileGuard } from './has-selected-file.guard';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    SelectFileComponent,
    LoadChocolateComponent,
    ChocolatePrintingComponent,
    ChocolateFinishedComponent,
    StaffComponent,
    ConnectComponent,
    StartPrintingComponent,
    FooterComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    AngularWebStorageModule
  ],
  providers: [HasSelectedFileGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }