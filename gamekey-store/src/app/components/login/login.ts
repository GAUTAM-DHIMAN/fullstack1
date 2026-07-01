import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  authForm!: FormGroup;
  isLoginMode = true;
  errorMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.authForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  get username() { return this.authForm.get('username'); }
  get password() { return this.authForm.get('password'); }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
  }

  onSubmit(): void {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const { username, password } = this.authForm.value;

    const authAction = this.isLoginMode
      ? this.authService.login(username, password)
      : this.authService.register(username, password);

    authAction.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/games']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Authentication failed. Please try again.';
      }
    });
  }
}
