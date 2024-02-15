import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {FormGroup,FormBuilder, Validators} from '@angular/forms'
import { Router } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { UserModel } from '../shared/model/user.model';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public signUpForm !: FormGroup;
  public signupObj = new UserModel();
  constructor(private fb :FormBuilder,private toster:ToastrService, private http : HttpClient,private router : Router, private api: ApiService) { }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      fullname:["", Validators.required],
      mobile:["",Validators.required],
      username:["",Validators.compose([Validators.required,Validators.email])],
      password:["",Validators.required],
      usertype:["",Validators.required]
    })
  }

  signUp(){
  
  this.signupObj.FullName = this.signUpForm.value.fullname;
  this.signupObj.UserName = this.signUpForm.value.username;
  this.signupObj.Password = this.signUpForm.value.password;
  this.signupObj.UserType = this.signUpForm.value.usertype;
  this.signupObj.Mobile = this.signUpForm.value.mobile
  this.api.signup(this.signupObj)
  .subscribe(res=>{
    this.toster.success(res.message);
    this.signUpForm.reset();
    this.router.navigate(['login'])
  })
}
}
