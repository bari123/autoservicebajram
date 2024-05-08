import {Component, OnInit, ViewChild} from '@angular/core';
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
  time: string;
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
  @ViewChild(ToasterComponent) toast?:ToasterComponent
  agenda: AgendaSlot[] = [];
  clients: Client[] = [];
  cars: Car[] = [];
  newClient: Client = {_id: '', fullname: '', address: '', phone: '', email: ''};
  newCar: Car = {make: '', model: '', year: '', engine: ''};
  selectedClient: Client | null = null;
  selectedSlot: string | null = null;
  selectedLift: number | null = null;
  description: string | null = null;
  currentDate: moment.Moment
  isNewClient = false;
  showModal = false;
  infoModal = false;
  client: Client | null = null;
  car: Car | null = null;
  lifts: Lift[] = [];

  constructor(private service: GlobalService) {
    this.currentDate = moment();
  }

  ngOnInit(): void {
    this.initializeLifts();
    this.loadAgenda();
    this.loadClients();
  }

  selectedDate(date: moment.Moment) {
    this.initializeLifts()
    this.currentDate = date
    this.loadAgenda()
  }

  async loadClients() {
    this.clients = await this.service.getClients();
  }

  async loadCars(): Promise<void> {
    if (this.selectedClient) {
      this.cars = await this.service.getClientCarsById(this.selectedClient._id);
    }
  }

  async saveAgenda() {
    if (this.selectedSlot && this.selectedLift && this.description) {
      await this.service.saveAgenda(this.selectedSlot, this.selectedLift, this.selectedClient, this.newCar, this.description, this.newClient,this.currentDate.toDate().toLocaleDateString());
    }
    this.loadAgenda()
    this.description=''
    this.toast?.show(false,'Termini u rezervua me sukses')
    this.closeModal()
  }

  async loadAgenda() {
    this.description=''
    this.agenda = await this.service.getAgenda(this.currentDate.toDate().toLocaleDateString());
    for (const lift of this.agenda) {
      for (const slot of lift.lift) {
      await this.updateReservedStatus(slot.lift, slot.time, true);
      }
    }
  }

  initializeLifts(): void {
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
    this.selectedSlot = slot.time;
    this.selectedLift = liftIndex + 1;
  }

  openModal(newAgenda: boolean, liftNumber?: number, slot?: string): void {
    if (!newAgenda) {
      this.showModal = true;
    } else {
      if (liftNumber && slot) {
        for (const test of this.agenda) {
          for (const lift of test.lift) {
            if (lift.time === slot && lift.lift === liftNumber) {
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

  private updateReservedStatus(liftNumber: number, time: string, newReservedStatus: boolean): void {
    const lift = this.lifts.find(l => l.lift === liftNumber);
    if (lift) {
      const slot = lift.timeslots.find(s => s.time === time);
      if (slot) {
        slot.reserved = newReservedStatus;
      }
    }
  }

  showAgenda(liftNumber: any,slot:any):string | null{
    if (liftNumber && slot) {
      for (const test of this.agenda) {
        for (const lift of test.lift) {
          if (lift.time === slot && lift.lift === liftNumber) {
            this.car = lift.car;
            this.client = lift.client;
            this.description = lift.service;
          }
        }
      }
      return this.description
    }
    return 'No info was provided'
  }
}
