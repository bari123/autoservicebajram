import {Injectable} from '@angular/core';
import axios from "axios";
import {environment} from "../environments/environment";
import {retry} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  env = environment
  axiosInstance = axios.create({
    baseURL: environment.BASE_URL,
  });


  constructor() {
  }

  async login(user:{username:string,password:string}){
   return await this.axiosInstance.post('/auth/login',user).then(res=>{
      return res.data.token
    })
  }

  async createClient(newClient: any) {
    await this.axiosInstance.post('/clients', newClient)

  }

  async getClients(): Promise<any[]> {
    return await this.axiosInstance.get('/clients/getAll').then(res => res.data);
  }

  async getClientById(id: string | null) {

    return await this.axiosInstance.get(`/clients/${id}`).then(res => {
      return res.data
    })
  }

  async addCarsToClients(car: any, id: string | null) {
    return await this.axiosInstance.post(`/clients/addCar/${id}`, car).then(res => {
      return res.data
    })
  }

  async getClientCarsById(id: string | null) {
    return await this.axiosInstance.get(`/clients/${id}/getCars`).then(res => {
      return res.data.cars
    })
  }

  async deleteCar(carId: string, clientId: string | null) {
    return await this.axiosInstance.delete(`/clients/${clientId}/car/${carId}`).then(res => {
      console.log(res)
    })
  }

  async addService(newService: any, clientId: string | null) {
    return await this.axiosInstance.post(`/clients/${clientId}/service`, newService).then(res => {
      console.log(res)
    })
  }

  async getServices(clientId: string | null) {
    return await this.axiosInstance.get(`/clients/${clientId}/services`).then(res => {
      return res.data.service
    })
  }

  async getServicesByCar(clientId: string | null, carId: string | null) {
    return await this.axiosInstance.get(`/clients/${clientId}/services/${carId}`).then(res => {

      return {service: res.data.service, car: res.data.cars}
    })
  }

  async saveAgenda(slot: any, lift: any, client: any, car: any, service: any, newClient: any) {
    let body = {
      lift: {
        time: slot,
        lift: lift,
        client: client ?? newClient,
        car: car,
        service: service
      },
      date: new Date().toLocaleDateString()
    }
    console.log(body)
    return await this.axiosInstance.post(`/agenda`, body).then(res => {
      console.log(res)
      return 'Success'
    })
  }

  async getAgenda() {
    return await this.axiosInstance.get(`/agenda/getAll`).then(res => {
      return res.data
    })
  }


}
