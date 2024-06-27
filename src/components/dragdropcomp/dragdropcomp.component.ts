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
    this.lifts = Array.from({length: 4}, (_, index) => ({
      lift: index + 1,
      timeslots: this.generateTimeslotsWithAgenda(index + 1)
    }));
  }

  async loadAgenda() {
    let dateToSearch
    if (this.date.toDate().toLocaleDateString() === this.currentDate.toDate().toLocaleDateString()) {
      dateToSearch = this.currentDate.toDate().toLocaleDateString()
    } else {
      dateToSearch = this.date.toDate().toLocaleDateString()
    }
    this.agenda = await this.service.getAgenda(dateToSearch);
    this.lifts = Array.from({length: 4}, (_, index) => ({
      lift: index + 1,
      timeslots: this.generateTimeslotsWithAgenda(index + 1)
    }));
  }


  drop(event: CdkDragDrop<any[]>, lift: any): void {
    const currentLiftIndex = lift.lift - 1;
    let oldLift;

    // Determine the indices of the current and previous lifts
    const currentIndex = event.currentIndex;
    const previousIndex = event.previousIndex;
    const containerId = parseInt(event.container.id.slice(-1));
    const previousContainerId = parseInt(event.previousContainer.id.slice(-1));

    // Determine if the drag event is within the same container
    const isSameContainer = event.previousContainer === event.container;

    // Retrieve the relevant timeslots
    const currentTimeslot = this.lifts[containerId].timeslots[currentIndex];
    const previousTimeslot = this.lifts[previousContainerId].timeslots[previousIndex];

    // Swap values and reserved statuses
    [currentTimeslot.value, previousTimeslot.value] = [previousTimeslot.value, currentTimeslot.value];
    [currentTimeslot.reserved, previousTimeslot.reserved] = [previousTimeslot.reserved, currentTimeslot.reserved];

    // Set oldLift if the drag event is between different containers
    if (!isSameContainer) {
      oldLift = previousContainerId + 1;
    }

    // Emit the new timeslot event
    this.newTimeSlot.emit({
      lift: lift.lift,
      timeslots: this.lifts[currentLiftIndex].timeslots,
      oldLift
    });
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
