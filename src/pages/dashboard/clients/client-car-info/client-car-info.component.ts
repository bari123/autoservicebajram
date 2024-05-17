import {Component, OnInit} from '@angular/core';
import {GlobalService} from "../../../../app/global.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-client-car-info',
  templateUrl: './client-car-info.component.html',
  styleUrls: ['./client-car-info.component.css']
})
export class ClientCarInfoComponent implements OnInit {

  newService={
    km:'',
    engineOil:false,
    airFilter:false,
    airConFilter:false,
    pumpFilter:false,
    oilFilter:false,
    description:''
}
  serviceHistory: any[] = []
  car:any

  constructor(private service: GlobalService, private route: ActivatedRoute) {
  }

  async getServiceByCar() {
    return await this.service.getServicesByCar(this.route.snapshot.paramMap.get('id'), this.route.snapshot.paramMap.get('carId'))
  }

  async getCar(){
    return await this.service.getClientCarByCarId(this.route.snapshot.paramMap.get('id'),this.route.snapshot.paramMap.get('carId'))
  }

  async ngOnInit() {
    this.car=await this.getCar()
    this.serviceHistory = await this.getServiceByCar().then(res=>{
      this.newService=res.service[0]
      return res.service
    })

  }

  setService(history: any) {
    this.newService = history
  }

}
