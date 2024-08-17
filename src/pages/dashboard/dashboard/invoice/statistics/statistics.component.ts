import {Component, OnInit} from '@angular/core';
import {GlobalService} from "../../../../../app/global.service";
import * as moment from "moment/moment";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  displayedColumns = ['serialCode', 'name', 'price', 'qnt','carAndYear'];
  items: any
  soldItem: any
  finalList: any[] = []
  totalSold: any
  monthStats: any
  currentDate: moment.Moment;
  dates?: moment.Moment[];
  selectedDate:any



  constructor(private globalService: GlobalService) {
    this.currentDate = moment();
    this.generateDates()
  }

  async ngOnInit() {

    this.monthStats = await this.globalService.getLastMonthStats()
    this.soldItem = (await this.globalService.getSoldItems(new Date().toLocaleDateString())).data
    for (const items of this.soldItem) {
      for (const innerItem of items.items) {
        this.finalList.push({...innerItem.item, qnt: innerItem.count})
      }
    }

    console.log(this.monthStats)

    this.sumSoldItems()
  }

  generateDates() {
    this.dates = [];
    let currentDate = moment(this.currentDate).startOf('week').add(1, 'day').locale('sq');
    for (let i = 0; i < 10; i++) {
      this.dates.push(currentDate.clone());
      currentDate.add(1, 'day');
    }
  }

  async loadSales(){
    this.finalList=[]
    if (this.selectedDate) {
      this.soldItem = (await this.globalService.getSoldItems(new Date(this.selectedDate).toLocaleDateString())).data
      for (const items of this.soldItem) {
        for (const innerItem of items.items) {
          this.finalList.push({...innerItem.item, qnt: innerItem.count})
          this.sumSoldItems()
        }
      }
    }
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

}
