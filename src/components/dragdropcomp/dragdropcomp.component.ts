import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-dragdropcomp',
  templateUrl: './dragdropcomp.component.html',
  styleUrls: ['./dragdropcomp.component.css']
})
export class DragdropcompComponent implements OnInit {
  @Input('timeslots') timeslots: any
  @Input('agenda') agenda: any
  @Input('lift') lift: any

  @Output() newTimeSlot = new EventEmitter<any>();

  @Output() clicked = new EventEmitter<any>()

  drop(event: CdkDragDrop<string[]>) {
    const draggedGroup = this.getGroup(this.timeslots[event.previousIndex]);
    const targetIndex = event.currentIndex;

    // Unreserve the previous slots
    draggedGroup.forEach(item => {
      item.reserved = false;
    });

    // Reserve the new slots
    draggedGroup.forEach((item, index) => {
      const targetSlotIndex = targetIndex + index;
      if (targetSlotIndex < this.timeslots.length) {
        this.timeslots[targetSlotIndex].reserved = true;
        moveItemInArray(this.timeslots, this.timeslots.indexOf(item), targetSlotIndex);
      }
    });

    this.newTimeSlot.emit({ lift: this.lift, timeslots: this.timeslots });
  }

  trackByItem(index: number, movie: string): string {
    return movie;
  }

  constructor() {
  }

  showAgenda(slot: any): string {
    for (const test of this.agenda) {
      for (const lift of test.lift) {
        if (lift.time.includes(slot) && lift.lift === this.lift) {
          return lift.service + '--' + lift.client?.fullname
        }
      }
    }
    return 'Lir'
  }

  isDoneAgenda(slot: any): boolean {
    return this.agenda.some((agenda: { lift: { time: string | any[]; lift: any; status: string; }[]; }) =>
      agenda.lift.some((lift: { time: string | any[]; lift: any; status: string; }) =>
        lift.time.includes(slot) && lift.lift === this.lift && lift.status === 'Done'
      )
    );
  }

  reserveSlot( slot: any): void {
    this.clicked.emit({slot:slot,liftIndex:this.lift})
  }

  ngOnInit(): void {
  }

  getGroup(slot: any): any[] {
    return this.timeslots.filter((item: { time: any; }) => this.showAgenda(item.time) === this.showAgenda(slot.time));
  }

}
