import { Component } from '@angular/core';
import {GlobalService} from "../../app/global.service";
import {Router} from "@angular/router";

@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private service:GlobalService,private router:Router) {
  }

  user:{username:string,password:string}= {
    username: '',
    password: ''
  }

  async login() {
    let token = await this.service.login(this.user).catch(err=>{
      if(err.response.status===401){
        alert('USER APO PASSWORDI GABIM')
      }
    })
    if(token){
      localStorage.setItem('token',token)
      await this.router.navigate(['/dashboard'])
    }
  }
}
