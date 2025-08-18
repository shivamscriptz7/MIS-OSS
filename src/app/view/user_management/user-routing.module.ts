import { UserListingComponent } from './user-listing/user-listing.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserRoleListingComponent } from '../master-forms/user-role-listing/user-role-listing.component';
import { UserPermissionComponent } from './user-permission/user-permission.component';


const routes: Routes = [{
  path: '',
  component: UserListingComponent

},
{
  path: 'user-profile',
  component: UserProfileComponent

},

{
  path: 'permissions',
  component: UserPermissionComponent

}



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
