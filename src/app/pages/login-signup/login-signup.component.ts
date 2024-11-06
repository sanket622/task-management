import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login-signup.component.html',
  styleUrl: './login-signup.component.css',
})
export class LoginSignupComponent {
  activeForm: 'login' | 'register' = 'login';
  registerObj: registerModel = new registerModel();
  loginObj: loginModel = new loginModel();
  emailError: string | null = null;
  passwordError: string | null = null;
  registrationError: string | null = null;

  constructor(private _snackbar: MatSnackBar, private _router: Router) {}

  toggleForm(form: 'login' | 'register') {
    this.activeForm = form;
    this.clearErrors();
  }

  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  validatePassword(password: string): boolean {
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordPattern.test(password);
  }
  registerForm() {
    this.clearErrors();

    if (
      this.registerObj.name &&
      this.registerObj.email &&
      this.registerObj.password
    ) {
      if (!this.validateEmail(this.registerObj.email)) {
        this.emailError = 'Please enter a valid email address.';
        return;
      }
      if (!this.validatePassword(this.registerObj.password)) {
        this.passwordError =
          'Password must be at least 6 characters, contain one uppercase letter, one lowercase letter, one number, and one special character.';
        return;
      }

      const localusers = localStorage.getItem('users');
      const users = localusers ? JSON.parse(localusers) : [];
      const isEmailExist = users.some(
        (user: registerModel) => user.email === this.registerObj.email
      );

      if (isEmailExist) {
        this.registrationError =
          'Email is already registered. Please use a different email.';
        this._snackbar.open(this.registrationError, 'close');
        return;
      }
      users.push(this.registerObj);
      localStorage.setItem('users', JSON.stringify(users));

      this._snackbar.open('User registered successfully', 'close');
    } else {
      this.registrationError = 'Fill all the required fields';
      this._snackbar.open(this.registrationError, 'close');
    }
  }

  loginForm() {
    this.clearErrors();
    if (!this.validateEmail(this.loginObj.email)) {
      this.emailError = 'Please enter a valid email address.';
      return;
    }
    if (!this.validatePassword(this.loginObj.password)) {
      this.passwordError =
        'Password must be at least 6 characters, contain one uppercase letter, one lowercase letter, one number, and one special character.';
      return;
    }

    const localusers = localStorage.getItem('users');
    if (localusers) {
      const users = JSON.parse(localusers);
      const isUserExist = users.find(
        (user: registerModel) =>
          user.email === this.loginObj.email &&
          user.password === this.loginObj.password
      );
      if (isUserExist) {
        this._snackbar.open('Login Successful', 'close');
        localStorage.setItem('loggedUser', JSON.stringify(isUserExist));
        this._router.navigateByUrl('/dashboard');
      } else {
        this._snackbar.open('Email or Password is incorrect!', 'close');
      }
    }
  }

  clearErrors() {
    this.emailError = null;
    this.passwordError = null;
  }
}

export class registerModel {
  name: string;
  email: string;
  password: string;
  constructor() {
    this.name = '';
    this.email = '';
    this.password = '';
  }
}

export class loginModel {
  email: string;
  password: string;
  constructor() {
    this.email = '';
    this.password = '';
  }
}
