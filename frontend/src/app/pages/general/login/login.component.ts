import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  })

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {}

  login() {
    this.authService.login(
      this.loginForm.get('email')?.value || "",
      this.loginForm.get('password')?.value || ""
    )
    .subscribe(
      {
        next: (res : any) => {
          const response = res.body

          const token = response.data.token || "";
          localStorage.setItem('salonToken', token);
          console.log(localStorage.getItem('salonToken'));


          this.authService.isAuth = true;
          this.router.navigateByUrl('landing-page');
        },
        error: (error: HttpErrorResponse) => {
          if(error.status === 403)
            this.loginFailed()
          else
            console.log(error)

        }
      }
    )
  }

  loginFailed() {
    this.toastr.error(
      'Email ou mot de passe incorrect'
    )

    return;
  }

}
