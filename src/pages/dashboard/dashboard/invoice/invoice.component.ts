import {Component, OnInit, ViewChild} from '@angular/core';
import {GlobalService} from "../../../../app/global.service";
import {ToasterComponent} from "../../../compo/toaster/toaster.component";

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  @ViewChild(ToasterComponent) toast?: ToasterComponent

  invoices: any
  showModal = false
  deleteModal = false
  afterSaveModal=false
  selectedId: string = ''
  searchTerm: string = ''
  newInvoice: any = {
    clientName: '',
    phone: '',
    items: [{
      art: '',
      price: '',
      qty: ''
    }]
  }
  invoiceToPrint: any = null

  constructor(private globalService: GlobalService) {
  }

  async ngOnInit() {
    await this.loadInvoices()
  }

  get filteredInvoices() {
    return this.invoices?.filter((item: { clientName: string; invoiceId: number; }) =>
      item.clientName?.toLowerCase().includes(this.searchTerm?.toLowerCase()) ||
      item.invoiceId === parseInt(this.searchTerm)
    );
  }

  async addInvoice() {
    this.invoiceToPrint=this.newInvoice
    return await this.globalService.saveInvoice(this.newInvoice).then(async res => {
      this.selectedId=res.data._id
      if (res.status === 201) {
        this.toast?.show(false, 'Faktura u shtua me sukses')
      } else {
        this.toast?.show(true, 'Faktura nuk mundi te shtohej')
      }
      this.showModal = false
      this.afterSaveModal=true
      await this.loadInvoices()
    })
  }

  addItem() {
    this.newInvoice.items.push({art: '', qty: '', price: ''})
  }

  async loadInvoices() {
    this.invoices = await this.globalService.getInvoices()
  }

  async deleteInvoice(id: string) {
    await this.globalService.deleteInvoice(id).then(res => {
      if (res.status === 200) {
        this.toast?.show(false, 'Faktura u fshi me sukses')
      } else {
        this.toast?.show(true, 'Faktura nuk mundi te fshihej')
      }
    })
    await this.loadInvoices()
  }

  async print(invoice: any) {
    this.invoiceToPrint = invoice
    setTimeout(() => {
      window.print()
    }, 1000);
  }

  async printAfter(){
   await this.print(await this.globalService.getInvoice(this.selectedId))
  }


}
