import {Component, OnInit} from '@angular/core';
import {GlobalService} from "../../../../app/global.service";
import {ActivatedRoute} from "@angular/router";
import {ToasterService} from "../../../compo/toaster/toaster.service";
import {CarModel} from 'src/utils/models/models.util';


@Component({
  selector: 'app-client-cars',
  templateUrl: './client-cars.component.html',
  styleUrls: ['./client-cars.component.css']
})
export class ClientCarsComponent implements OnInit {
  showModal = false;
  serviceModal = false;
  deleteModal = false;
  carIdSelected: string | null = null;
  newCar: CarModel = this.createEmptyCar();
  newService = this.createEmptyService();
  filteredClients: CarModel[] = [];


  constructor(private service: GlobalService, private route: ActivatedRoute, private toast: ToasterService) {
  }

  async ngOnInit() {
    await this.getCars()
  }


  createEmptyCar(): CarModel {
    return {
      _id: undefined,
      model: '',
      make: '',
      year: '',
      engine: ''
    };
  }

  createEmptyService() {
    return {
      km: '',
      airFilter: undefined,
      oilFilter: undefined,
      engineOil: undefined,
      pumpFilter: undefined,
      airConFilter: undefined,
      description: '',
      carId: ''
    };
  }

  openModal(modal: string, car: any): void {
    switch (modal) {
      case 'edit':
        this.showModal = true;
        if (car) this.newCar = car;
        break;
      case 'delete':
        if (car) this.carIdSelected = car._id!;
        this.deleteModal = true;
        break;
      case 'service':
        if (car) this.carIdSelected = car._id!;
        this.serviceModal = true;
        break;
    }
  }


  closeModal(): void {
    this.showModal = this.serviceModal = this.deleteModal = false;
    this.newCar = this.createEmptyCar();
    this.newService = this.createEmptyService();
    this.carIdSelected = null;
  }

  async addCar() {
    return this.service.addCarsToClients(this.newCar, this.route.snapshot.paramMap.get('id')).then(() => {
        this.closeModal()
        this.getCars()
        this.toast.showToast(false, 'Makina u ruajt me sukses')
      }
    )
  }

  async editCar(): Promise<void> {
    if (this.newCar._id) {
      await this.service.editCarById(this.route.snapshot.paramMap.get('id')!, this.newCar._id, this.newCar);
      this.toast.showToast(false, 'Makina u ruajt me sukses');
    } else {
      await this.addCar();
    }
    this.closeModal();
    await this.getCars();
  }

  async deleteCar() {
    return this.service.deleteCar(this.carIdSelected, this.route.snapshot.paramMap.get('id')).then(() => {
      this.toast.showToast(true, 'Makina u fshi me sukses')
      this.closeModal()
      this.getCars()
    })
  }

  async getCars() {
    this.filteredClients = await this.service.getClientCarsById(this.route.snapshot.paramMap.get('id'))
  }

  async addService(): Promise<void> {
    this.newService.carId = this.carIdSelected!;
    await this.service.addService(this.newService, this.route.snapshot.paramMap.get('id')!);
    this.toast.showToast(false, 'Shërbimi u shtua me sukses');
    this.closeModal();
  }

}
