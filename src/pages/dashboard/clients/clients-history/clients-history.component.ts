import {Component, OnInit} from '@angular/core';
import {GlobalService} from "../../../../app/global.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-clients-history',
  templateUrl: './clients-history.component.html',
  styleUrls: ['./clients-history.component.css']
})
export class ClientsHistoryComponent implements OnInit {

  constructor(private service: GlobalService, private route: ActivatedRoute) {
  }

  showModal = false;

  info = {
    km: '',
    airFilter: true,
    oilFilter: false,
    engineOil: true,
    pumpFilter: false,
    airConFilter: true,
    description: ''
  }

  history: any[] = []

  closeModal() {
    this.showModal = false
  }

  openModal(service: any) {
    this.showModal = true
    this.info = service
  }

  async getService() {
    return await this.service.getServices(this.route.snapshot.paramMap.get('id'))
  }

  async ngOnInit() {
    this.history = await this.getService()
  }

}
