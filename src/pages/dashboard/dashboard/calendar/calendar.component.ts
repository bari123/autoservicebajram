import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  showModal=false
  lifts = [
    {
      lift: 1, timeslots: [
        {time: '09:00', reserved: false},
        {time: '10:00', reserved: false},
        {time: '11:00', reserved: false},
        {time: '12:00', reserved: false},
        {time: '13:00', reserved: false},
        {time: '14:00', reserved: false},
        {time: '15:00', reserved: false},
        {time: '16:00', reserved: false},
        {time: '17:00', reserved: false},
      ]
    },
    {
      lift: 2, timeslots: [
        {time: '09:00', reserved: false},
        {time: '10:00', reserved: false},
        {time: '11:00', reserved: false},
        {time: '12:00', reserved: false},
        {time: '13:00', reserved: false},
        {time: '14:00', reserved: false},
        {time: '15:00', reserved: false},
        {time: '16:00', reserved: false},
        {time: '17:00', reserved: false},
      ]
    },
    {
      lift: 3, timeslots: [
        {time: '09:00', reserved: false},
        {time: '10:00', reserved: false},
        {time: '11:00', reserved: false},
        {time: '12:00', reserved: false},
        {time: '13:00', reserved: false},
        {time: '14:00', reserved: false},
        {time: '15:00', reserved: false},
        {time: '16:00', reserved: false},
        {time: '17:00', reserved: false},
      ]
    },
    {
      lift: 4, timeslots: [
        {time: '09:00', reserved: false},
        {time: '10:00', reserved: false},
        {time: '11:00', reserved: false},
        {time: '12:00', reserved: false},
        {time: '13:00', reserved: false},
        {time: '14:00', reserved: false},
        {time: '15:00', reserved: false},
        {time: '16:00', reserved: false},
        {time: '17:00', reserved: false},
      ]
    },

  ]


  reserveSlot(liftIndex: number, slotIndex: number) {
    // Toggle reservation status of the selected timeslot
    this.lifts[liftIndex].timeslots[slotIndex].reserved = !this.lifts[liftIndex].timeslots[slotIndex].reserved;
  }

  openModal(){
    this.showModal=true
  }
  closeModal(){
    this.showModal=false
  }

  constructor() {
  }

  ngOnInit(): void {
  }

}
