import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  mobileMenuToggle = false

  constructor(public route: Router) {
  }

  ngOnInit(): void {
  }

  logOut() {
    localStorage.clear()
    location.reload()
  }

    protected readonly localStorage = localStorage;
}
