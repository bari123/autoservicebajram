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

  async login(user: { username: string, password: string }) {
    return await this.axiosInstance.post('/auth/login', user).then(res => {
      return res.data.token
    })
  }

  async createClient(newClient: any) {
    await this.axiosInstance.post('/clients', newClient)
  }

  async editClient(newClient: any,id:string|null) {
    await this.axiosInstance.post(`/clients/${id}/edit`, newClient)
  }

  async getClients(): Promise<any[]> {
    const {data} = await this.axiosInstance.get('/clients/getAll')
    return data
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

  async getClientCarByCarId(id: string | null, carId: string | null) {
    return await this.axiosInstance.get(`/clients/${id}/getCar/${carId}`).then(res => {
      return res.data.cars[0]
    })
  }

  async editCarById(clientId: string | null, carId: string, car: any) {
    return await this.axiosInstance.patch(`/clients/${clientId}/car/${carId}`, car).then(res => {

    })
  }

  async deleteCar(carId: string, clientId: string | null) {
    return await this.axiosInstance.delete(`/clients/${clientId}/car/${carId}`).then(res => {
    })
  }

  async deleteClient(clientId: string) {
    return await this.axiosInstance.delete(`/clients/${clientId}`)
  }

  async addService(newService: any, clientId: string | null) {
    return await this.axiosInstance.post(`/clients/${clientId}/service`, newService).then(res => {
    })
  }

  async addServiceFromInvoice(invoiceId: string, clientId: string | null) {
    return await this.axiosInstance.post(`/clients/${clientId}/service/invoice/${invoiceId}`)
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

  async editAgendaService(serviceId: string | null) {
    return await this.axiosInstance.post(`/agenda/${serviceId}/finish`)
  }

  async deleteAgenda(serviceId: string | null) {
    return await this.axiosInstance.delete(`/agenda/${serviceId}`)
  }

  async saveAgenda(slot: any, lift: any, client: any, car: any, service: any, newClient: any, date: string, estimation: string) {
    let body = {
      lift: {
        time: slot,
        lift: lift,
        client: client ?? newClient,
        car: car,
        service: service,
      },
      date: date,
      estimation: estimation
    }
    return await this.axiosInstance.post(`/agenda`, body).then(res => {
      return 'Success'
    })
  }

  async saveAgendaDrop(selectedId: string, slot: any, lift: any, client: any, car: any, service: any, newClient: any, date: string, estimation: string) {
    let body = {
      lift: {
        time: slot,
        lift: lift,
        client: client ?? newClient,
        car: car,
        service: service,
      },
      date: date,
      estimation: estimation
    }
    return await this.axiosInstance.post(`agenda/${selectedId}/update`, body).then(res => {
      return 'Success'
    })
  }

  async getAgenda(currentDate: string | null) {
    return await this.axiosInstance.post(`/agenda/getAll`, {currentDate: currentDate}).then(res => {
      return res.data
    })
  }

  async getItems() {
    const {data} = await this.axiosInstance.get('/items')
    return data
  }

  async saveItem(item: any) {
    return await this.axiosInstance.post('items', item)
  }

  async updateItem(item: any, id: string) {
    return await this.axiosInstance.patch(`items/${id}`, item)
  }

  async deleteItem(id: string) {
    return await this.axiosInstance.delete(`items/${id}`)
  }

  async getItemBySerialCode(code: string) {
    const {data} = await this.axiosInstance.get('items/serialCode/' + code)
    return data
  }

  async getInvoices() {
    const {data} = await this.axiosInstance.get('/invoice')
    return data
  }

  async saveInvoice(invoice: any) {
    return await this.axiosInstance.post('invoice', invoice)
  }

  async updateInvoice(invoice: any, id: string) {
    return await this.axiosInstance.patch(`invoice/${id}`, invoice)
  }

  async deleteInvoice(id: string) {
    return await this.axiosInstance.delete(`invoice/${id}`)
  }

  async payInvoice(id: string) {
    return await this.axiosInstance.post(`invoice/${id}/pay`)
  }

  async getInvoice(id: string) {
    const {data} = await this.axiosInstance.get(`invoice/${id}`)
    return data
  }

}
