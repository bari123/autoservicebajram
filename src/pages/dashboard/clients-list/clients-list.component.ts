import {Component, OnInit, ViewChild} from '@angular/core';
import {GlobalService} from "../../../app/global.service";
import {ToasterComponent} from "../../compo/toaster/toaster.component";

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.css']
})
export class ClientsListComponent implements OnInit {
  @ViewChild(ToasterComponent) toast?: ToasterComponent

  selectedId=''
  clients: any[] = [];
  searchTerm: string = '';
  newClient = {
    fullname: '',
    address: '',
    phone: '',
    email: ''
  }

  showModal = false
  deleteModal=false

  get filteredClients() {
    return this.clients.filter(client =>
      client.fullname?.toLowerCase().includes(this.searchTerm?.toLowerCase()) ||
      client.email?.toLowerCase().includes(this.searchTerm?.toLowerCase())
    );
  }


  constructor(private service: GlobalService) {
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
    await this.service.createClient(this.newClient).then(res => {
      this.toast?.show(false, 'Klienti u ruajt me sukses')
      this.loadClients()
    })
    this.switchModal()
  }

  async deleteClient(id: string) {
    return await this.service.deleteClient(id).then(res => {
      this.toast?.show(true, 'Klienti u fshi me sukses')
      this.loadClients()

    })
  }


}
