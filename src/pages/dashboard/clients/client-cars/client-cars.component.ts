import {Component, OnInit, ViewChild} from '@angular/core';
import {GlobalService} from "../../../../app/global.service";
import {ActivatedRoute} from "@angular/router";
import {ToasterComponent} from "../../../compo/toaster/toaster.component";

interface CarModel{
  model:string,
  make:string,
  _id?:string,
  year:string,
  engine:string
}

@Component({
  selector: 'app-client-cars',
  templateUrl: './client-cars.component.html',
  styleUrls: ['./client-cars.component.css']
})
export class ClientCarsComponent implements OnInit {

  @ViewChild(ToasterComponent) successToast?: ToasterComponent;

  showModal = false;
  serviceModal = false;
  deleteModal = false;
  carIdSelected: any
  newCar:CarModel = {
    _id:undefined,
    model: '',
    make: '',
    year: '',
    engine: ''
  }

  newService = {
    km: '',
    airFilter: undefined,
    oilFilter: undefined,
    engineOil: undefined,
    pumpFilter: undefined,
    airConFilter: undefined,
    description: '',
    carId: ''
  }

  filteredClients: any [] = []

  openModal(modal: string, carId: any | null) {
    if (modal === 'edit') {
      this.showModal = true
      if(carId){
      this.newCar = carId
      }
    } else if (modal === 'delete') {
      this.carIdSelected = carId._id
      this.deleteModal = true
    } else {
      this.carIdSelected = carId._id
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
        this.successToast?.show(false, 'Makina u ruajt me sukses')
      }
    )
  }

  async editCar(car: any) {
    this.closeModal()
    if (car._id!==undefined) {
      return this.service.editCarById(this.route.snapshot.paramMap.get('id'), car._id, car).then(res => {
        this.closeModal()
        this.getCars()
        this.successToast?.show(false, 'Makina u ruajt me sukses')
      })
    } else {
      await this.addCar()
    }
  }

  async deleteCar() {
    return this.service.deleteCar(this.carIdSelected, this.route.snapshot.paramMap.get('id')).then(res => {
      this.successToast?.show(true, 'Makina u fshi me sukses')
      this.closeModal()
      this.getCars()
    })
  }

  async getCars() {
    this.filteredClients = await this.service.getClientCarsById(this.route.snapshot.paramMap.get('id'))
  }

  async addService() {
    this.newService.carId = this.carIdSelected
    await this.service.addService(this.newService, this.route.snapshot.paramMap.get('id'))
    this.closeModal()
  }


  async ngOnInit() {
    await this.getCars()
  }


  openCarInfo() {
    // this.route.s
  }

}
