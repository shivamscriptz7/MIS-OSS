import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRoleListingComponent } from './user-role-listing/user-role-listing.component';

const routes: Routes = [{
  path:'',
  component:UserRoleListingComponent

}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule { }
