import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clients-history',
  templateUrl: './clients-history.component.html',
  styleUrls: ['./clients-history.component.css']
})
export class ClientsHistoryComponent implements OnInit {

  showModal=false;

  info={
    aftertKm:350000,
    preKm:320000,
    airFilter:true,
    oilFilter:false,
    engineOil:true,
    pumpFilter:false,
  }

  closeModal(){
    this.showModal=false
  }

  openModal(){
    this.showModal=true
  }
  constructor() { }

  ngOnInit(): void {
  }

}
