import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe(
      (response: any) => {
        if (response && response.role) {
          // Redirect based on role
          if (response.role === 'admin') {
            this.router.navigate(['/students']); // Redirect Admin to student list
          } else if (response.role === 'staff') {
            this.router.navigate(['/students']); // Redirect Staff to student list
          }
        }
      },
      (error) => {
        this.errorMessage = 'Invalid email or password';
      }
    );
  }
}


