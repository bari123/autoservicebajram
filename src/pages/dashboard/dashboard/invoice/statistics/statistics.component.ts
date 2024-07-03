import {Component, OnInit} from '@angular/core';
import {GlobalService} from "../../../../../app/global.service";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  dataPoints: any = [];
  chart: any
  items: any
  soldItem: any
  finalList: any[] = []
  totalSold: any
  monthStats:any

  displayedColumns = ['serialCode', 'name', 'price', 'qnt',];

  getChartInstance(chart: object) {
    this.chart = chart;
  }

  constructor(private globalService: GlobalService) {
  }

  async ngOnInit() {
    this.monthStats=await this.globalService.getLastMonthStats()
    this.soldItem = (await this.globalService.getSoldItems(new Date().toLocaleDateString())).data
    for (const items of this.soldItem) {
      for (const innerItem of items.items) {
        this.finalList.push({...innerItem.item, qnt: innerItem.count})
      }
    }
    this.dataPoints = await this.globalService.getStats()
    this.dataPoints.forEach((res: { x: string | number | Date; y: string }) => {
      res.x = new Date(res.x)
    })

    this.chartOptions.data[0].dataPoints = this.dataPoints
    this.chart.render()
    this.sumSoldItems()
  }

  chartOptions = {
    theme: 'dark2',
    backgroundColor: '#dc3545',
    title: {
      text: "Numri i artikujve te shitur gjate muajve",
      fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
      fontWeight: "bold",
      fontColor: "black",

    },
    axisY: {
      title: "Numri i artikujve te shitur",
      titleFontColor: "black",
      valueFormatString: "#,###.##"
    },
    axisX: {
      title: "Data",
      valueFormatString: "DD/MM/YYYY"
    },
    data: [{
      lineDashType: "dash",
      type: "spline",
      xValueFormatString: "DD/MM/YYYY",
      yValueFormatString: "#,###.##",
      lineColor: 'white',
      markerColor: 'black',
      dataPoints: []
    }]
  }

  piechartOptions = {
    animationEnabled: true,
    title: {
      text: "Klientet me me shume servise",
      fontColor: 'black'
    },
    backgroundColor: '#dc3545',
    subtitles: [{
      text: "Mesatarja ne muaj",
      fontColor: 'black'
    }],
    data: [{
      type: "pie", //change type to column, line, area, doughnut, etc
      indexLabel: "{name}: {y}%",
      indexLabelFontColor: "white",
      dataPoints: [
        {name: "Iljaz Iseni", y: 9.1},
        {name: "Bari Ademi", y: 3.7},
        {name: "Auto Shkolla Momento", y: 36.4},
        {name: "Agan Beqiri", y: 30.7},
        {name: "Bajram Iseni", y: 20.1}
      ]
    }]
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
