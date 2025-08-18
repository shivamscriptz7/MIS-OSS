import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPswdForm: FormGroup;
  constructor(public fb: FormBuilder, public service: CommonService, public router: Router) {
    this.forgotPswdForm = this.fb.group({
      user_email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(echelonedge.com)$/)]]

    })
  }

  ngOnInit(): void {
  }
  get forgotPswdContoller() {
    return this.forgotPswdForm.controls;
  }
  // for forgot password submit button
  onSubmit() {
    let obj = {
      email_id: this.forgotPswdForm.value.user_email
    }
    if (this.forgotPswdForm.invalid) {
      return
    } else {
      this.service.postAPIMethod('/forgot-passowrd', obj).subscribe((res) => {
        if (res.result.ERR === 'X') {
          this.sweetAlertMsg('error', res.result.MSG)
        } else {
          this.sweetAlertMsg('success', res.result[0].MSG);
          this.router.navigate(['/login']);
          //this.ngOnInit();

        }
        // this.router.navigate(['/login']);
      })
    }
  }
  // Toaster Function
  sweetAlertMsg(typeIcon: any, msg: any) {
    Swal.fire({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      icon: typeIcon,
      timer: 5000,
      title: msg,
    });
  }
}
