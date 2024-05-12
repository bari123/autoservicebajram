import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-date-slider',
  templateUrl: './date-slider.component.html',
  styleUrls: ['./date-slider.component.css']
})
export class DateSliderComponent implements OnInit {
  @Output() dateSelected = new EventEmitter<any>();
  selectedIndex?: number
  selectedDate: any

  currentDate: moment.Moment;
  dates?: moment.Moment[];
  hoverIndex?: number | null

  constructor() {
    this.currentDate = moment();
    this.selectedIndex = this.currentDate.day() - 1;
    this.selectedDate = moment()
    this.generateDates();
  }

  ngOnInit(): void {
  }

  generateDates() {
    this.dates = [];
    let currentDate = moment(this.currentDate).startOf('week').add(1, 'day').locale('sq');
    for (let i = 0; i < 6; i++) {
      this.dates.push(currentDate.clone());
      currentDate.add(1, 'day');
    }
  }

  prevWeek() {
    this.currentDate.subtract(1, 'week');
    this.selectedIndex = this.currentDate.day() - 1;
    this.generateDates();
  }

  nextWeek() {
    this.currentDate.add(1, 'week');
    this.selectedIndex = this.currentDate.day() - 1;
    this.generateDates();
  }

  prevDay() {
    this.currentDate.subtract(1, 'day');
    this.selectedIndex = this.currentDate.day() - 1;
    this.generateDates();
    this.emitDate(this.currentDate)
  }

  nextDay() {
    this.currentDate.add(1, 'day');
    this.selectedIndex = this.currentDate.day() - 1;
    this.generateDates();
    this.emitDate(this.currentDate)

  }

  isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  emitDate(date: any) {
    this.dateSelected.emit(date)
  }

  isSelected(index: any, selectedIndex: any, date: any, selectedData: any) {
    return index === selectedIndex
  }


}
