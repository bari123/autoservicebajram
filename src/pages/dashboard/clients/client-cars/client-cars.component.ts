import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-client-cars',
  templateUrl: './client-cars.component.html',
  styleUrls: ['./client-cars.component.css']
})
export class ClientCarsComponent implements OnInit {

  showModal = false;
  serviceModal = false;

  filteredClients: any[] = [
    {
      brand: 'Benz',
      engine: 2.2,
      year: 2020
    },
    {
      brand: 'BMW',
      engine: 3.1,
      year: 2023
    }]

  openModal(modal: string) {
    if (modal === 'edit') {
      this.showModal = true
    } else {
      this.serviceModal = true
    }
  }

  closeModal() {
    this.serviceModal=false
    this.showModal = false
  }

  constructor() {
  }


  ngOnInit(): void {
  }

}
