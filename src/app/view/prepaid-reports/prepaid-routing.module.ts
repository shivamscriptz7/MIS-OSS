import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrepaidComponent } from './prepaid/prepaid.component';


const routes: Routes = [
  {
    path: 'prepaid',
    component: PrepaidComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrepaidRoutingModule { }
