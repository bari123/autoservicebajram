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

  items: [{ name: string, price: number, serialCode: string, qnt: number, originalQty:number }] |null=null
  newItem = {
    name: '',
    serialCode:'',
    price:0,
    qnt:0
  }
  code = ""
  mouseenter: boolean = false
  searchTerm: string = ""
  different: boolean = false
  showModal = false

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
    if(this.newItem){
    this.newItem.serialCode=this.code
    }
    return await this.globalService.saveItem(this.newItem).then(res=>{if(res.status===201){
      this.toast?.show(false, 'Klienti u ruajt me sukses')
    }})
  }

  async loadItems() {
    this.items = await this.globalService.getItems()
    if(this.items){
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
        this.newItem ={... await this.globalService.getItemBySerialCode(event.target.value)}
      }, 2000)
    }
  }

  protected readonly Math = Math;
}
