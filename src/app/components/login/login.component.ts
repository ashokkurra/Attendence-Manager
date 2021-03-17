import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from "../../app.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, public router: Router, private appService: AppService, private message: NzMessageService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
    this.appService.getUsers().subscribe((users) => {
      localStorage.setItem('users', JSON.stringify(users));
    });
  }

  submitForm(): void {
    if (this.loginForm.valid) {
      let users = JSON.parse(localStorage.getItem('users'));
      let formValues = { ...this.loginForm.value };
      let loginError = true;
      users.forEach(user => {
        if (formValues.userName === user.userName && formValues.password === user.password) {
          this.router.navigate(["/attendance"]);
          this.message.create('success', 'LoggedIn Successfully');
          loginError = false;
        }
      });
      if(loginError){
        this.loginForm.reset();
        this.message.create('error', 'Please check your username or password')
      }      
    } else {
      for (const i in this.loginForm.controls) {
        this.loginForm.controls[i].markAsDirty();
        this.loginForm.controls[i].updateValueAndValidity();
      }
    }
  }
}
