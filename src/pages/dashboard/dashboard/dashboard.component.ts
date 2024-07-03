import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  mobileMenuToggle = false

  routes = [
    {
      name: 'Klientet  ',
      route: 'clients-list',
      icon: 'people',
      role: ['admin']
    },
    {
      name: 'Terminet ',
      route: 'calendar',
      icon: 'calendar_month',
      role: ['user', 'admin']
    },
    {
      name: 'Fakturat',
      route: 'invoice',
      icon: 'receipt_long',
      role: [ 'admin']
    },
    {
      name: 'Magazina',
      route: 'storage',
      icon: 'warehouse',
      role: ['admin','user']
    },
    {
      name: 'Statistika',
      route: 'statistics',
      icon: 'monitoring',
      role: ['admin']
    }

  ]

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
