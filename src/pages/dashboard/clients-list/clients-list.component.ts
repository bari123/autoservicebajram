import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.css']
})
export class ClientsListComponent implements OnInit {
  clients: any[] = [{name:'Client 1',email:'email@test.com',id:2},
    {name:'Client 1',email:'email@test.com',id:1}]; // Array of clients
  searchTerm: string = ''; // Search term entered by the user

  showModal=false
  newClient:any={}

  get filteredClients() {
    return this.clients.filter(client =>
        client.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  constructor() { }

  ngOnInit(): void {
  }

  addClient(){
    this.showModal=true
  }

  closeModal(){
    this.showModal=false
  }

}
