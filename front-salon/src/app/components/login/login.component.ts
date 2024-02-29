import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // If the user is already logged in, redirect them to the home/dashboard page
    // this.authService.isAuthenticated().subscribe(isAuth => {
    //   if (isAuth) {
    //     this.router.navigate(['/']); 
    //   }
    // });
  }

  login(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        // On successful login, navigate to the dashboard or home page
        this.router.navigate(['/']);
      },
      error: (error) => {
        // Display an error message if login fails
        this.error = error.error.message || 'Failed to login';
      }
    });
  }
}
