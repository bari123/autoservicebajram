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

  displayedColumns = ['invoiceId', 'Name', 'Price', 'Actions'];

  invoices: any
  showModal = false
  deleteModal = false
  afterSaveModal = false
  previewModal = false
  selectedId: string = ''
  selectedClient: any
  selectedCar: any
  cars: any
  clients: any
  newItem: any
  isNewClient: boolean = true
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
  canSubmit = false
  newService = {
    km: '',
    airFilter: undefined,
    oilFilter: undefined,
    engineOil: undefined,
    pumpFilter: undefined,
    airConFilter: undefined,
    description: '',
    carId: '',
    invoiceId: ''
  }

  constructor(private globalService: GlobalService) {
  }

  async ngOnInit() {
    await this.loadInvoices()
    await this.loadClients();

  }

  get filteredInvoices() {
    return this.invoices?.filter((item: { clientName: string; invoiceId: number; }) =>
      item.clientName?.toLowerCase().includes(this.searchTerm?.toLowerCase()) ||
      item.invoiceId === parseInt(this.searchTerm)
    );
  }

  async addInvoice() {
    this.invoiceToPrint = this.newInvoice
    return await this.globalService.saveInvoice(this.newInvoice).then(async res => {
      this.newService.carId = this.selectedCar._id
      this.newService.invoiceId = res.data._id
      await this.globalService.addService(this.newService, this.selectedClient._id)
      this.selectedId = res.data._id
      if (res.status === 201) {
        this.toast?.show(false, 'Faktura u shtua me sukses')
      } else {
        this.toast?.show(true, 'Faktura nuk mundi te shtohej')
      }
      this.showModal = false
      this.afterSaveModal = true
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

  async printAfter() {
    await this.print(await this.globalService.getInvoice(this.selectedId))
    this.afterSaveModal = false
  }

  async loadCars(): Promise<void> {
    if (this.selectedClient) {
      this.cars = await this.globalService.getClientCarsById(this.selectedClient._id);
    }
  }

  async loadClients() {
    this.clients = await this.globalService.getClients();
  }

  async changes(event: any, index: any) {
    if (event.target.value.length >= 6) {
      setTimeout(async () => {
        this.newItem = await this.globalService.getItemBySerialCode(event.target.value)
        if (this.newItem.length !== 0) {
          this.toast?.show(false, 'Te dhenat u gjeten me sukses')
          this.newInvoice.items[index].art = this.newItem.serialCode
          this.newInvoice.items[index].qty = 1
          this.newInvoice.items[index].price = this.newItem.price
        } else {
          this.toast?.show(true, 'Nuk egziston nje artikull me kete kod')
        }
      }, 1000)
    }
  }

  updatePrice(i: any) {
    if (this.newItem) {
      this.newInvoice.items[i].price = this.newInvoice.items[i].qty * this.newItem.price
    }
  }

  carSelected() {
    this.newInvoice.clientName = this.selectedClient.fullname
    this.newInvoice.carId = this.selectedCar._id
    this.newInvoice.phone = this.selectedClient.phone
  }

  cantSubmit(art: any) {
    this.canSubmit = this.newItem && art.qty > this.newItem.qnt
    return this.canSubmit
  }

  openPreview(row: any) {
    this.invoiceToPrint = row
    this.previewModal = true
  }

  protected readonly Date = Date;
}