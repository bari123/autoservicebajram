import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {GlobalService} from '../../../../app/global.service';
import * as moment from "moment";
import {ToasterComponent} from "../../../compo/toaster/toaster.component";

interface Client {
  _id: string;
  fullname: string;
  address: string;
  phone: string;
  email: string;
}

interface Car {
  make: string;
  model: string;
  year: string;
  engine: string;
}

interface Timeslot {
  time: string;
  reserved: boolean;
}

interface Lift {
  service: string | null;
  client: Client | null;
  car: Car | null;
  time: string[];
  lift: number;
  timeslots: Timeslot[];
}

interface AgendaSlot {
  lift: Lift[];
  client: Client;
  car: Car;
  service: string;
}


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @ViewChild(ToasterComponent) toast?: ToasterComponent
  agenda: AgendaSlot[] = [];
  clients: Client[] = [];
  cars: Car[] = [];
  newClient: Client = {_id: '', fullname: '', address: '', phone: '', email: ''};
  newCar: Car = {make: '', model: '', year: '', engine: ''};
  selectedClient: Client | null = null;
  selectedSlot: string[] | null = null;
  selectedLift: number | null = null;
  description: string | null = null;
  currentDate: moment.Moment
  isNewClient = false;
  estimation = ''
  showModal = false;
  infoModal = false;
  client: Client | null = null;
  car: Car | null = null;
  lifts: Lift[] = [];

  constructor(private service: GlobalService, private cdr: ChangeDetectorRef) {
    this.currentDate = moment();
  }

  ngOnInit(): void {

    this.loadAgenda();
    this.loadClients();
    this.initializeLifts();
  }

  isSunday() {
    return this.currentDate.day() === 0
  }

  isWeekDay(date: moment.Moment) {
    return date.day() !== 0
  }

  selectedDate(date: moment.Moment) {
    this.initializeLifts()
    this.currentDate = date
    this.loadAgenda()
    this.isWeekDay(this.currentDate)
  }

  async loadClients() {
    this.clients = await this.service.getClients();
  }

  async loadCars(): Promise<void> {
    if (this.selectedClient) {
      this.cars = await this.service.getClientCarsById(this.selectedClient._id);
    }
  }

  async saveAgenda(estimation: string) {
    if (this.selectedSlot && this.selectedLift && this.description) {
      await this.service.saveAgenda(this.selectedSlot, this.selectedLift, this.selectedClient, this.newCar, this.description, this.newClient, this.currentDate.toDate().toLocaleDateString(), estimation);
    }
    this.description = null
    this.toast?.show(false, 'Termini u rezervua me sukses')
    this.closeModal()
    this.loadAgenda()
  }

  async loadAgenda() {
    this.agenda = await this.service.getAgenda(this.currentDate.toDate().toLocaleDateString());
    for (const lift of this.agenda) {
      for (const slot of lift.lift) {
        await this.updateReservedStatus(slot.lift, slot.time, true);
      }
    }
  }

  initializeLifts(): void {
    this.description = ''
    // @ts-ignore
    this.lifts = Array.from({length: 4}, (_, index) => ({
      lift: index + 1,
      timeslots: this.generateTimeslots()
    }));
  }

  generateTimeslots(): Timeslot[] {
    return [
      {time: '08:00', reserved: false},
      {time: '09:00', reserved: false},
      {time: '10:00', reserved: false},
      {time: '11:00', reserved: false},
      {time: '12:00', reserved: false},
      {time: '13:00', reserved: false},
      {time: '14:00', reserved: false},
      {time: '15:00', reserved: false},
      {time: '16:00', reserved: false},
      {time: '17:00', reserved: false},
    ];
  }

  reserveSlot(liftIndex: number, slotIndex: number, slot: Timeslot): void {
    this.selectedSlot = [slot.time];
    this.selectedLift = liftIndex + 1;
  }

  openModal(newAgenda: boolean, liftNumber?: number, slot?: any): void {
    if (!newAgenda) {
      this.description = null
      this.showModal = true;
      this.client = null
      this.car=null
    } else {
      if (liftNumber && slot) {
        for (const test of this.agenda) {
          for (const lift of test.lift) {
            if (lift.time.includes(slot) && lift.lift === liftNumber) {
              console.log(lift.car)
              this.car = lift.car;
              this.client = lift.client;
              this.description = lift.service;
            }
          }
        }
      }
      this.infoModal = true;
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.infoModal = false
  }

  toggleClientSelection(): void {
    this.isNewClient = !this.isNewClient;
  }

  private updateReservedStatus(liftNumber: number, time: string[], newReservedStatus: boolean): void {
    const lift = this.lifts.find(l => l.lift === liftNumber);
    if (lift) {
      time.forEach(slotTime => {
        const slot = lift.timeslots.find(s => s.time === slotTime);
        if (slot) {
          slot.reserved = newReservedStatus;
        }
      });
    }
  }

  showAgenda(liftNumber: any, slot: any): string  {
    for (const test of this.agenda) {
      for (const lift of test.lift) {
        if (lift.time.includes(slot) && lift.lift === liftNumber) {
          return lift.service + '--' + lift.client?.fullname
        }
      }
    }
    return 'Lir'
  }

  showAgendaClient(liftNumber: any, slot: any): string | undefined {
    for (const test of this.agenda) {
      for (const lift of test.lift) {
        if (lift.time.includes(slot) && lift.lift === liftNumber) {
          return lift.client?.fullname
        }
      }
    }
    return 'Lir'
  }
}
