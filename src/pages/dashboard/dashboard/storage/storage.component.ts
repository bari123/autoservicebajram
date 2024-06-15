import {Component, OnInit, ViewChild} from '@angular/core';
import {GlobalService} from "../../../../app/global.service";
import {ToasterComponent} from "../../../compo/toaster/toaster.component";

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.css']
})
export class StorageComponent implements OnInit {
  @ViewChild(ToasterComponent) toast?: ToasterComponent;

  items: [{
    _id: string,
    name: string,
    price: number,
    serialCode: string,
    qnt: number,
    originalQty: number
  }] | null = null
  newItem = {
    name: '',
    serialCode: '',
    price: 0,
    qnt: 0
  }
  code = ""
  mouseenter: boolean = false
  searchTerm: string = ""
  different: boolean = false
  showModal = false
  deleteModal = false
  selectedId = ''

  constructor(private globalService: GlobalService) {
  }

  async ngOnInit() {
    await this.loadItems()
  }

  get filteredItems() {
    return this.items?.filter(item =>
      item.serialCode?.toLowerCase().includes(this.searchTerm?.toLowerCase())
    );
  }

  itemQuantity(item: any, method: string) {
    if (method === "add") {
      item.qnt++
    } else {
      item.qnt--
    }

    this.different = item.qnt !== item.originalQnt;
  }

  async saveItem() {
    if (this.newItem) {
      this.newItem.serialCode = this.code
    }
    try {
      await this.globalService.saveItem(this.newItem)
      this.toast?.show(false, 'Klienti u ruajt me sukses')
      await this.loadItems()
    } catch (e) {
      this.toast?.show(true, 'Klienti nuk u ruajt ')
    }
    this.showModal=false
  }

  async loadItems() {
    this.items = await this.globalService.getItems()
    if (this.items) {
      // @ts-ignore
      this.items = this.items.map(item => ({
        ...item,
        originalQnt: item.qnt
      }));
    }
  }

  changes(event: any) {
    if (event.target.value.length >= 6) {
      setTimeout(async () => {
        this.newItem = {...await this.globalService.getItemBySerialCode(event.target.value)}
      }, 2000)
    }
  }

  async deleteItem(id: string) {
    try {
      await this.globalService.deleteItem(id)
      this.toast?.show(true, 'Artikulli u fshi me sukses')
      this.loadItems()
    } catch (e) {
      this.toast?.show(true, 'Artikulli nuk u fshi me sukses , kontaktoni supportin')

    }
  }

  async updateItem(item: any) {
    try {
      await this.globalService.updateItem(item, item._id)
      this.toast?.show(false, 'Artikulli u azhurua me sukses')
      await this.loadItems()
    } catch (e) {
      this.toast?.show(true, 'Artikulli nuk u azhurua , kontaktoni supportin')
    }
  }

  protected readonly Math = Math;
}
