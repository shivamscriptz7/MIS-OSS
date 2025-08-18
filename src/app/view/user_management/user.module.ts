import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { UserListingComponent } from './user-listing/user-listing.component';
import { AddUpdateUserComponent } from './add-update-user/add-update-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HttpClientModule } from '@angular/common/http';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { AvatarModule } from 'ngx-avatar';
import { UserPermissionComponent } from './user-permission/user-permission.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

//import { SelectAutocompleteModule } from 'mat-select-autocomplete';










@NgModule({
  declarations: [
    UserListingComponent,
    AddUpdateUserComponent,
    UserProfileComponent,
    ResetPasswordComponent,
    ChangePasswordComponent,
    UserPermissionComponent



  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
    AvatarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule,
    MatTreeModule,
    MatButtonModule,
    MatAutocompleteModule,






    NgMultiSelectDropDownModule.forRoot(),




  ],

})
export class UserModule { }
