import {Component, OnInit} from '@angular/core';
import {GlobalService} from "../../../app/global.service";
import {ToasterService} from "../../compo/toaster/toaster.service";

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.css']
})
export class ClientsListComponent implements OnInit {

  constructor(private service: GlobalService, private toaster: ToasterService) {
  }

  selectedId = ''
  clients: any[] = [];
  searchTerm: string = '';
  newClient = {
    fullname: '',
    address: '',
    phone: '',
    email: ''
  }

  showModal = false
  deleteModal = false

  get filteredClients() {
    return this.clients.filter(client =>
      client.fullname?.toLowerCase().includes(this.searchTerm?.toLowerCase()) ||
      client.email?.toLowerCase().includes(this.searchTerm?.toLowerCase())
    );
  }


  async ngOnInit() {
    await this.loadClients()
  }

  async loadClients() {
    this.clients = await this.service.getClients()
  }

  switchModal() {
    this.showModal = !this.showModal
  }

  async saveClient() {
    await this.service.createClient(this.newClient).then(() => {
      this.toaster.showToast(false, 'Klienti u ruajt me sukses')
      this.loadClients()
    })
    this.switchModal()
  }

  async deleteClient(id: string) {
    return await this.service.deleteClient(id).then(() => {
      this.toaster.showToast(true, 'Klienti u fshi me sukses')
      this.loadClients()

    })
  }


}
