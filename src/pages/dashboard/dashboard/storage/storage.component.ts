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
  displayedColumns = ['count','serialCode','name', 'shelfNumber','price', 'qnt','engineType','carAndYear','description','saveButton'];

  // @ts-ignore
  items: [{
    _id: string,
    name: string,
    price: number,
    serialCode: string,
    qnt: number,
    shelfNumber:string,
    description:string,
    engineType:string,
    carAndYear:string,
    originalQty: number
  }]  = []
  newItem = {
    name: '',
    serialCode: '',
    price: 0,
    qnt: 0,
    shelfNumber:'',
    description:'',
    engineType:'',
    carAndYear:''
  }
  code = ""
  mouseenter: boolean = false
  searchTerm: string = ""
  showModal = false
  deleteModal = false
  selectedId = ''
  originalQuantities: { [serialCode: string]: number } = {};

  constructor(private globalService: GlobalService) {
  }

  async ngOnInit() {
    await this.loadItems()
  }

  get filteredItems() {
    return this.items?.filter(item =>
      item.serialCode?.toLowerCase().includes(this.searchTerm?.toLowerCase()) ||
      item.carAndYear?.toLowerCase().includes(this.searchTerm?.toLowerCase()) ||
      item.name?.toLowerCase().includes(this.searchTerm?.toLowerCase())
    );
  }

  itemQuantity(item: any, method: string) {
    method==='add'?item.qnt++:item.qnt--
  }

  hasChanged(item: any) {
    return item.qnt !== this.originalQuantities[item.serialCode];
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
    // @ts-ignore
    this.originalQuantities = this.items.reduce((acc: { [x: string]: any; }, item: { serialCode: string | number; qnt: any; }) => {
      acc[item.serialCode] = item.qnt;
      return acc;
    }, {});
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

  reminders(state: string) {
    if (this.items) {
      let items;
      if (state === 'warning') {
        items = this.items.filter(item => item.qnt < 5 && item.qnt >= 3 ).map(item => item.serialCode);
      } else if (state==='dangerous'){
        items = this.items.filter(item => item.qnt===0 ).map(item => item.serialCode);
      }
      else {
        items = this.items.filter(item => item.qnt < 3).map(item => item.serialCode);
      }
      return items.toString();
    } else {
      return null;
    }
  }


  protected readonly Math = Math;
}
