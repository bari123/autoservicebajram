import {Component, OnInit} from '@angular/core';
import {GlobalService} from "../../../app/global.service";

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.css']
})
export class ClientsListComponent implements OnInit {
  clients: any[] = [];
  searchTerm: string = '';
  newClient = {
    fullname: '',
    address: '',
    phone: '',
    email: ''
  }

  showModal = false

  get filteredClients() {
    return this.clients.filter(client =>
      client.fullname?.toLowerCase().includes(this.searchTerm?.toLowerCase()) ||
      client.email?.toLowerCase().includes(this.searchTerm?.toLowerCase())
    );
  }

  constructor(private service: GlobalService) {
  }

  async ngOnInit() {
    this.clients = await this.service.getClients()
  }


  switchModal(){
    this.showModal=!this.showModal
  }
  async saveClient() {
    await this.service.createClient(this.newClient)
    this.switchModal()
  }

}
