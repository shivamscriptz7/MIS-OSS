import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrepaidComponent } from './prepaid/prepaid.component';
import { PrepaidRoutingModule } from './prepaid-routing.module';


@NgModule({
  declarations: [PrepaidComponent],
  imports: [
    CommonModule,
    PrepaidRoutingModule
  ]
})
export class PrepaidModule { }
