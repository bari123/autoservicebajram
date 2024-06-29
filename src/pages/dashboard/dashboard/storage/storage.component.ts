import {Component, OnInit} from '@angular/core';
import {GlobalService} from "../../../../app/global.service";
import {ItemsModel} from "../../../../utils/models/models.util";
import {ToasterService} from "../../../compo/toaster/toaster.service";

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.css']
})
export class StorageComponent implements OnInit {
  displayedColumns = ['serialCode', 'name', 'shelfNumber', 'price', 'qnt', 'carAndYear', 'engineType', 'description', 'saveButton'];
  items: ItemsModel[] = []
  newItem = {
    name: '',
    serialCode: '',
    price: 0,
    qnt: 0,
    shelfNumber: '',
    description: '',
    engineType: '',
    carAndYear: ''
  }
  code = ""
  mouseenter: boolean = false
  searchTerm: string = ""
  showModal = false
  deleteModal = false
  remainingModal = false
  soldModal = false
  selectedId = ''
  originalQuantities: { [serialCode: string]: number } = {};
  remainingItems: any
  remainingModalTitle: string = ''
  soldItem: any
  totalSold: any

  constructor(private globalService: GlobalService, private toasterService: ToasterService) {
  }

  async ngOnInit() {
    this.soldItem = await this.getSoldItems()
    await this.loadItems()
    this.sumSoldItems()
  }


  sumSoldItems() {
    this.totalSold = 0;
    for (const items of this.soldItem) {
      for (const item of items.items) {
        const price = parseFloat(item.item.price); // Ensure price is a number
        const count = parseInt(item.count, 10); // Ensure count is a number
        if (!isNaN(price) && !isNaN(count)) {
          this.totalSold += (price * count);
        } else {
          console.error("Invalid price or count:", item.item.price, item.count);
        }
      }
    }

  }

  get filteredItems() {
    return this.items?.filter(item =>
      item.serialCode?.toLowerCase().includes(this.searchTerm?.toLowerCase()) ||
      item.carAndYear?.toLowerCase().includes(this.searchTerm?.toLowerCase()) ||
      item.name?.toLowerCase().includes(this.searchTerm?.toLowerCase())
    );
  }


  async getSoldItems() {
    const {data} = await this.globalService.getSoldItems(new Date().toLocaleDateString())
    return data
  }

  itemQuantity(item: any, method: string) {
    if (method === 'remove' && item.qnt === 0) {
      return
    }
    method === 'add' ? item.qnt++ : item.qnt--
  }

  hasChanged(item: any) {
    return item.qnt !== this.originalQuantities[item.serialCode];
  }

  soldItems(item: any) {
    return item.qnt - this.originalQuantities[item.serialCode]
  }

  async saveItem() {
    if (this.newItem) {
      this.newItem.serialCode = this.code
    }
    try {
      await this.globalService.saveItem(this.newItem)
      this.toasterService.showToast(false, 'Klienti u ruajt me sukses')
      await this.loadItems()
    } catch (e) {
      this.toasterService.showToast(true, 'Klienti nuk u ruajt ')
    }
    this.showModal = false
  }

  async loadItems() {
    this.items = await this.globalService.getItems()
    this.originalQuantities = this.items.reduce((acc: { [x: string]: any; }, item: {
      serialCode: string | number;
      qnt: any;
    }) => {
      acc[item.serialCode] = item.qnt;
      return acc;
    }, {});
  }

  async changes(event: any) {
    this.newItem = {...await this.globalService.getItemBySerialCode(event.toUpperCase())}
  }

  async deleteItem(id: string) {
    try {
      await this.globalService.deleteItem(id)
      this.toasterService.showToast(true, 'Artikulli u fshi me sukses')
      await this.loadItems()
    } catch (e) {
      this.toasterService.showToast(true, 'Artikulli nuk u fshi me sukses , kontaktoni supportin')
    }
  }

  async updateItem(item: any) {
    try {
      await this.globalService.updateItem(item, item._id)
      let newItemSold = {...item, sold: this.soldItems(item), date: new Date().toLocaleDateString()}
      await this.globalService.soldItem(newItemSold, item._id)
      this.toasterService.showToast(false, 'Artikulli u azhurua me sukses')
      await this.loadItems()
    } catch (e) {
      this.toasterService.showToast(true, 'Artikulli nuk u azhurua , kontaktoni supportin')
    }
  }

  reminders(state: string) {
    if (!this.items) return null;
    switch (state) {
      case 'warning':
        return this.items.filter(item => item.qnt < 5 && item.qnt >= 3);
      case 'dangerous':
        return this.items.filter(item => item.qnt === 0);
      default:
        return this.items.filter(item => item.qnt < 3);
    }
  }

  openRemainingModal(state: string) {
    this.remainingItems = this.reminders(state)
    this.remainingModal = true
  }


  protected readonly Math = Math;
  protected readonly localStorage = localStorage;
}
