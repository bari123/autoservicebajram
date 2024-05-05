import {Component, OnInit} from '@angular/core';
import {GlobalService} from "../../../../app/global.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-client-cars',
  templateUrl: './client-cars.component.html',
  styleUrls: ['./client-cars.component.css']
})
export class ClientCarsComponent implements OnInit {

  showModal = false;
  serviceModal = false;
  deleteModal = false;
  carIdSelected: any
  newCar = {
    model: '',
    make: '',
    year: '',
    engine: ''
  }

  newService = {
    km:'',
    airFilter: undefined,
    oilFilter: undefined,
    engineOil: undefined,
    pumpFilter: undefined,
    airConFilter: undefined,
    description:'',
    carId:''
  }

  filteredClients: any [] = []

  openModal(modal: string, carId: any | null) {
    if (modal === 'edit') {
      this.showModal = true
      this.newCar = carId
    } else if (modal === 'delete') {
      this.carIdSelected = carId._id
      this.deleteModal = true
    } else {
      console.log(carId)
      this.carIdSelected=carId._id
      this.serviceModal = true
    }
  }


  closeModal() {
    this.serviceModal = false
    this.showModal = false
    this.deleteModal = false
  }

  constructor(private service: GlobalService, private route: ActivatedRoute) {
  }


  async addCar() {
    return this.service.addCarsToClients(this.newCar, this.route.snapshot.paramMap.get('id')).then(res => {
        this.closeModal()
        this.getCars()
      }
    )
  }

  async deleteCar() {
    return this.service.deleteCar(this.carIdSelected, this.route.snapshot.paramMap.get('id')).then(res => {
      this.closeModal()
      this.getCars()
    })
  }

  async getCars() {
    this.filteredClients = await this.service.getClientCarsById(this.route.snapshot.paramMap.get('id'))
  }

  async addService(){
    this.newService.carId=this.carIdSelected
    await this.service.addService(this.newService,this.route.snapshot.paramMap.get('id'))
    this.closeModal()
  }


  async ngOnInit() {
    await this.getCars()
  }


  openCarInfo(){
    // this.route.s
  }

}
