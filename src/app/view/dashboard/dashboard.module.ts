import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TooltipPosition, MatTooltipModule } from '@angular/material/tooltip';
// import { BrowserModule } from '@angular/platform-browser';
// import {ApexCharts} from 'apexcharts';
// import { IonicPageModule } from 'ionic-angular';



@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgApexchartsModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,

    // NgApexchartsModule,
  ]
})
export class DashboardModule { }
