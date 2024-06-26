import {Component, ViewChild} from '@angular/core';
import {GlobalService} from "../../app/global.service";
import {Router} from "@angular/router";
import * as jwt_decode from "jwt-decode";
import {ToasterComponent} from "../compo/toaster/toaster.component";
import {ToasterService} from "../compo/toaster/toaster.service";


@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private service: GlobalService, private router: Router, private toasterService: ToasterService) {
  }

  user: { username: string, password: string } = {
    username: '',
    password: ''
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode.jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }

  async login() {
    let role
    let token = await this.service.login(this.user).catch(err => {
      if (err.response.status === 401) {
        this.toasterService.showToast(true, 'USERNAME APO PASSWORDI GABIM')
      }
    })
    role = this.getDecodedAccessToken(token)

    if (token) {
      localStorage.setItem('token', token)
      localStorage.setItem('role', role.role)
      if (role.role === 'user') {
        await this.router.navigate(['/dashboard/calendar'])
      } else {
        await this.router.navigate(['/dashboard'])
      }
      this.toasterService.showToast(false, 'Useri u logua me sukses')
    }
  }
}
