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
  pieChart: any
  salesChart: any
  items: any
  soldItem: any
  finalList: any[] = []
  totalSold: any
  monthStats: any
  clientStats: any
  highestSalesClient: any
  peakSales:any

  displayedColumns = ['serialCode', 'name', 'price', 'qnt',];

  getChartInstance(chart: object) {
    this.chart = chart;
  }

  getPieChartInstance(chart: object) {
    this.pieChart = chart
  }

  getSalesChartInstance(chart: object) {
    this.salesChart = chart
  }

  constructor(private globalService: GlobalService) {
  }

  async ngOnInit() {
    this.peakSales=await this.globalService.getPeakSales()
    this.peakSales.forEach((res: { x: string | number | Date; y: string }) => {
      res.x = new Date(res.x)
    })
    this.monthStats = await this.globalService.getLastMonthStats()
    this.clientStats = await this.globalService.getClientStats()
    this.highestSalesClient = this.clientStats.highestClient
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
    this.piechartOptions.data[0].dataPoints = this.clientStats.result
    this.saleschartOptions.data[0].dataPoints = this.peakSales
    this.chart.render()
    this.pieChart.render()
    this.salesChart.render()
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

  saleschartOptions = {
    theme: 'dark2',
    backgroundColor: '#dc3545',
    title: {
      text: "Shitjet ne muajt e fundit",
      fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
      fontWeight: "bold",
      fontColor: "black",

    },
    axisY: {
      title: "Shuma e fakturave ne denar",
      titleFontColor: "black",
      valueFormatString: "#,###.##"
    },
    axisX: {
      title: "Data",
      valueFormatString: "DD/MM/YYYY"
    },
    data: [{
      type: "line",
      xValueFormatString: "DD/MM/YYYY",
      yValueFormatString: "#,###.## mkd",
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
      type: "pie",
      indexLabel: "{name}: {y}%",
      indexLabelFontColor: "white",
      dataPoints: []
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
