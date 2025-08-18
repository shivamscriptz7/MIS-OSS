import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { UserRoleListingComponent } from './user-role-listing/user-role-listing.component';
import { UserRoleListingComponent } from './user-role-listing/user-role-listing.component';
import { AddUpdateUserRoleComponent } from './add-update-user-role/add-update-user-role.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoleRoutingModule } from './master-routing.module';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { UserRoutingModule } from '../user_management/user-routing.module';
import {MatSelectModule} from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';




@NgModule({
  declarations: [ UserRoleListingComponent,
    AddUpdateUserRoleComponent],
  imports: [
    CommonModule,
    RoleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
     
  ]
})
export class RoleModule { }
