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
  previewModal = false
  invoiceToPrint: any

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

  async openModal(service: any) {
    if (service.invoiceId) {
      this.invoiceToPrint=await this.service.getInvoice(service.invoiceId)
      this.previewModal = true
    } else {

      this.showModal = true
      this.info = service
    }
  }

  async getService() {
    return await this.service.getServices(this.route.snapshot.paramMap.get('id'))
  }

  async ngOnInit() {
    this.history = await this.getService()
  }

  protected readonly Date = Date;


}
