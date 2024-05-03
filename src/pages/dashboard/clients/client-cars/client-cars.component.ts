import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-client-cars',
  templateUrl: './client-cars.component.html',
  styleUrls: ['./client-cars.component.css']
})
export class ClientCarsComponent implements OnInit {

  showModal = false;
  serviceModal = false;
  cars:any

  filteredClients: any[] = [
    {
      brand: 'Benz',
      engine: 2.2,
      model:'C-klasse',
      year: 2020
    },
    {
      brand: 'BMW',
      model:'320i',
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

  async getCars(){
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    // @ts-ignore
    fetch("https://carapi.app/api/makes", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    // this.cars=await axios.get('https://carapi.app/api/makes')
    // console.log(this.cars)
  }


  async ngOnInit() {
    await this.getCars()
  }

}
