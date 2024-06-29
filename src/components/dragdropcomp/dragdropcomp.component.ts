import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {generateTimeslots} from "../../utils/timeslotGenerator.util";
import {GlobalService} from "../../app/global.service";
import * as moment from "moment/moment";

@Component({
  selector: 'app-dragdropcomp',
  templateUrl: './dragdropcomp.component.html',
  styleUrls: ['./dragdropcomp.component.css']
})
export class DragdropcompComponent implements OnInit, OnChanges {

  @Output() newTimeSlot = new EventEmitter<any>();

  @Output() clicked = new EventEmitter<any>()

  @Input('date') date?: any

  ngOnChanges(changes: SimpleChanges) {
    if (changes['date']) {
      this.loadAgenda()
    }
  }


  lifts: any;
  agenda: any
  currentDate: moment.Moment = moment()


  constructor(private service: GlobalService) {
  }

  async ngOnInit() {
    this.agenda = await this.service.getAgenda(this.currentDate.toDate().toLocaleDateString());
    this.lifts=[]
    this.lifts = Array.from({length: 4}, (_, index) => ({
      lift: index + 1,
      timeslots: this.generateTimeslotsWithAgenda(index + 1)
    }));

  }

  async loadAgenda() {
    const currentDateString = this.currentDate.toDate().toLocaleDateString();
    const dateString = this.date.toDate().toLocaleDateString();

    const dateToSearch = (dateString === currentDateString) ? currentDateString : dateString;
    this.agenda = await this.service.getAgenda(dateToSearch);
    this.lifts=[]
    this.lifts = Array.from({length: 4}, (_, index) => ({
      lift: index + 1,
      timeslots: this.generateTimeslotsWithAgenda(index + 1)
    }));
  }

  drop(event: CdkDragDrop<any[]>, lift: any): void {
    let oldLift
    if (event.previousContainer === event.container) {
      let value = this.lifts[lift.lift - 1].timeslots[event.currentIndex].value
      let reserved = this.lifts[lift.lift - 1].timeslots[event.currentIndex].reserved
      this.lifts[lift.lift - 1].timeslots[event.currentIndex].value = this.lifts[lift.lift - 1].timeslots[event.previousIndex].value
      this.lifts[lift.lift - 1].timeslots[event.currentIndex].reserved = this.lifts[lift.lift - 1].timeslots[event.previousIndex].reserved
      this.lifts[lift.lift - 1].timeslots[event.previousIndex].value = value
      this.lifts[lift.lift - 1].timeslots[event.previousIndex].reserved = reserved
    } else {
      let liftIndex = event.container.id.slice(-1)
      let liftIndexPrevious = event.previousContainer.id.slice(-1)
      let value = this.lifts[liftIndex].timeslots[event.currentIndex].value
      let reserved = this.lifts[liftIndex].timeslots[event.currentIndex].reserved
      this.lifts[liftIndex].timeslots[event.currentIndex].value = this.lifts[liftIndexPrevious].timeslots[event.previousIndex].value
      this.lifts[liftIndex].timeslots[event.currentIndex].reserved = this.lifts[liftIndexPrevious].timeslots[event.previousIndex].reserved
      this.lifts[liftIndexPrevious].timeslots[event.previousIndex].value = value
      this.lifts[liftIndexPrevious].timeslots[event.previousIndex].reserved = reserved
      oldLift = parseInt(liftIndexPrevious)
      oldLift = oldLift + 1
    }
    this.newTimeSlot.emit({lift: lift.lift, timeslots: this.lifts[lift.lift - 1].timeslots, oldLift});
  }
  trackByItem(index: number, item: any): any {
    return item;
  }

  checkIfSame(index: number, lift: any[]): boolean {
    if (index < lift.length - 1) {
      if (lift[index].value !== 'Lir') {
        return lift[index].value === lift[index + 1].value || lift[index]?.value === lift[index - 1]?.value;
      }
    }
    return false;
  }

  reserveSlot(slot: any, lift: any): void {
    this.clicked.emit({slot: slot, liftIndex: lift.lift})
  }

  showAgenda(slot: any, lifts: any): string {
    for (const test of this.agenda) {
      for (const lift of test.lift) {
        if (lift.time.includes(slot.time) && lift.lift === lifts.lift) {
          return lift.service + '--' + lift.client?.fullname
        }
      }
    }
    return 'Lir'
  }

  isDoneAgenda(slot: any, lifts: any): boolean {
    return this.agenda.some((agenda: { lift: { time: string | any[]; lift: any; status: string; }[]; }) =>
      agenda.lift.some((lift: { time: string | any[]; lift: any; status: string; }) =>
        lift.time.includes(slot.time) && lift.lift === lifts.lift && lift.status === 'Done'
      )
    );
  }

  valueIndexMap: any = {};
  result: any

  generateTimeslotsWithAgenda(liftIndex: number) {
    const timeslots = generateTimeslots();
    timeslots.forEach((slot, index) => {
      slot.value = this.showAgenda(slot, {lift: liftIndex});
      if (slot.value !== 'Lir') {
        if (!this.valueIndexMap[slot.value]) {
          this.valueIndexMap[slot.value] = [];
        }
        this.valueIndexMap[slot.value].push(index);
        slot.reserved = true;
      }
    });
    const duplicateValues = Object.keys(this.valueIndexMap).filter(value => this.valueIndexMap[value].length > 1);

    this.result = duplicateValues.map(value => {
      return {value, indexes: this.valueIndexMap[value]};
    });

    return timeslots;
  }

}
