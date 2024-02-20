import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientRegisterService } from '../../../services/client-register.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    gender: new FormControl('', [Validators.required])
  })

  constructor(private registerService: ClientRegisterService, private router: Router) {}

  register() {
    this.registerService.register({
      firstName: this.signupForm.get('firstName')?.value || '',
      lastName: this.signupForm.get('lastName')?.value || '',
      email: this.signupForm.get('email')?.value || '',
      password: this.signupForm.get('password')?.value || '',
      gender: this.signupForm.get('gender')?.value || ''
    })
    .subscribe({
      next: (res: any) => {
        const response = res.body

        console.log('Link to verify account ' + response.link);

        this.router.navigateByUrl('landing-page');
      },
      error: (error: HttpErrorResponse) => {
        console.log(error)
      }
    })
  }

}
