// import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { UserModel } from '../shared/model/user.model';
import { HttpClient } from '@angular/common/http';
import { LoginModel } from '../shared/model/login.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
public loginObj = new UserModel();

constructor(
  private fb: FormBuilder,
  private router: Router,
  private api: ApiService ,
private toster:ToastrService
) {}

ngOnInit(): void {
  // Initialize the login form with validators
  this.loginForm = this.fb.group({
    email: ["", Validators.compose([Validators.required, Validators.email])],
    password: ["", Validators.required]
  });

  // Clear localStorage on component initialization
  localStorage.clear();
}

login(): void {
  // Create a user object with login credentials
  this.loginObj.UserName = this.loginForm.value.email;
  this.loginObj.Password = this.loginForm.value.password;

  // Call the login API
  this.api.login(this.loginObj)
    .subscribe(
      (res: any) => {
        // If login successful, navigate to the dashboard
        this.toster.success(res.message);
        this.router.navigate(['dashboard']);

        // Store the token and user type in localStorage
        localStorage.setItem('token', res.token);
        localStorage.setItem('userType', res.userType);
      },
      (err: any) => {
        // If login fails, display an error message
        if (err.status === 401) {
          alert("Invalid email or password. Please try again.");
        } else if (err.status === 0) {
          alert("Network error occurred. Please check your internet connection.");
        } else {
          alert("Login failed. Please try again later.");
        }
      }
    );
}

}
