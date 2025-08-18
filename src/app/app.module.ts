import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { ValidationDirective } from './directive/validation.directive';
import { SharedModule } from './shared/shared/shared.module'
//import { PdfJsViewerModule } from 'ng2-pdfjs-viewer'
//import { NgxLoadingModule } from "ngx-loading";
import { AuthInterceptor } from './services/interceptor/auth.interceptor';
import { HeaderComponent } from './view/header/header.component';
import { ViewModule } from './view/view.module';
import { FormsModule } from '@angular/forms';
import { AuthGuardService } from './services/auth-guard.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AvatarModule } from 'ngx-avatar';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MenuListComponent } from './view/menu-list/menu-list/menu-list.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SortingPipe } from '../app/pipe/date-filter.pipe';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
// import { TooltipModule } from 'ngx-bootstrap/tooltip';
// import jsPDF from 'jspdf'
// import autoTable from 'jspdf-autotable'
// import { MenuItemComponent } from './view/menu-list/menu-list/menu-list.component';
//import { DeleteDialogBoxComponent } from './dialogbox/delete-dialog-box/delete-dialog-box.component';
//import { StatusChangeDialogBoxComponent } from './dialogbox/status-change-dialog-box/status-change-dialog-box.component';




@NgModule({
  declarations: [
    AppComponent,
    ValidationDirective,
    HeaderComponent,
    PageNotFoundComponent,
    MenuListComponent,
    SortingPipe // Declare the sorting pipe


    //DeleteDialogBoxComponent,
    //StatusChangeDialogBoxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    //PdfJsViewerModule,
    SharedModule,
    NgxUiLoaderModule,
    FormsModule,
    ViewModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AvatarModule,
    MatTreeModule,
    MatIconModule,
    MatMenuModule,
    NgSelectModule,
    TooltipModule.forRoot()

    // MAT_DIALOG_DATA,

    //DpDatePickerModule

  ],
  providers: [HttpClient, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuardService],
  bootstrap: [AppComponent],
  exports: [SharedModule],
})
export class AppModule { }
