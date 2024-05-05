import {Injectable} from '@angular/core';
import axios from "axios";

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor() {
  }

  async createClient(newClient: any) {
    await axios.post('http://localhost:3000/clients', newClient).then(res => {
      console.log('success', res)
    })
  }

  async getClients() {
    return await axios.get('http://localhost:3000/clients/getAll').then(res => {
      return res.data
    })
  }

  async getClientById(id: string | null) {
    return await axios.get(`http://localhost:3000/clients/${id}`).then(res => {
      return res.data
    })
  }

  async addCarsToClients(car: any, id: string | null) {
    return await axios.post(`http://localhost:3000/clients/addCar/${id}`, car).then(res => {
      return res.data
    })
  }

  async getClientCarsById(id: string | null) {
    return await axios.get(`http://localhost:3000/clients/${id}/getCars`).then(res => {
      return res.data.cars
    })
  }

  async deleteCar(carId: string, clientId: string | null) {
    return await axios.delete(`http://localhost:3000/clients/${clientId}/car/${carId}`).then(res => {
      console.log(res)
    })
  }

  async addService(newService: any, clientId: string | null) {
    return await axios.post(`http://localhost:3000/clients/${clientId}/service`, newService).then(res => {
      console.log(res)
    })
  }

  async getServices(clientId: string | null) {
    return await axios.get(`http://localhost:3000/clients/${clientId}/services`).then(res => {
      return res.data.service
    })
  }

  async getServicesByCar(clientId: string | null, carId: string | null) {
    return await axios.get(`http://localhost:3000/clients/${clientId}/services/${carId}`).then(res => {

      return {service: res.data.service, car: res.data.cars}
    })
  }

  async saveAgenda(slot: any,lift:any, client: any, car: any, service: any,newClient:any) {
    let body = {
      lift: {
        time: slot,
        lift: lift,
        client: client ??newClient,
        car: car,
        service: service
      },
      date:new Date().toLocaleDateString()
    }
    console.log(body)
    return await axios.post('http://localhost:3000/agenda', body).then(res => {
      console.log(res)
      return 'Success'
    })
  }

  async getAgenda() {
    return await axios.get('http://localhost:3000/agenda/getAll').then(res => {
      return res.data
    })
  }




}
