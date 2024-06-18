import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
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
  status: string;
}

interface AgendaSlot {
  _id: string;
  lift: Lift[];
  client: Client;
  car: Car;
  service: string;
  status: string
  estimation: string
}


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css', '../../../../styles.css']
})
export class CalendarComponent implements OnInit {
  @ViewChild(ToasterComponent) toast?: ToasterComponent
  agenda: AgendaSlot[] = [];
  clients: Client[] = [];
  cars: Car[] = [];
  newClient: Client = {_id: '', fullname: '', address: '', phone: '', email: ''};
  newCar: Car = {make: '', model: '', year: '', engine: ''};
  selectedClient: Client | null = null;
  selectedCar: Car | null = null;
  selectedSlot: string[] | null = null;
  selectedLift: number | null = null;
  selectedLiftId: string | null = null
  description: string | null = null;
  currentDate: moment.Moment
  isNewClient = false;
  estimation = ''
  showModal = false;
  finishWorkModal = false;
  doneModals = false
  infoModal = false;
  client: Client = {_id: '', fullname: '', address: '', phone: '', email: ''};
  car: Car | null = null;
  lifts: Lift[] = [];

  constructor(private service: GlobalService, private cdr: ChangeDetectorRef) {
    this.currentDate = moment();
  }

  async ngOnInit() {
    await this.loadAgenda();
    await this.loadClients();
    this.initializeLifts();
  }

  isSunday() {
    return this.currentDate.day() === 0
  }

  isWeekDay(date: moment.Moment) {
    return date.day() !== 0
  }

 async selectedDate(date: moment.Moment) {
    this.initializeLifts()
    this.currentDate = date
    await this.loadAgenda()
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
      if (this.selectedCar !== null) {
        this.newCar = this.selectedCar
      }
      await this.service.saveAgenda(this.selectedSlot, this.selectedLift, this.selectedClient, this.newCar, this.description, this.newClient, this.currentDate.toDate().toLocaleDateString(), estimation);
    }
    this.description = null
    this.toast?.show(false, 'Termini u rezervua me sukses')
    this.closeModal()
    this.loadAgenda()
  }

  async deleteAgenda() {
    await this.service.deleteAgenda(this.selectedLiftId).then(res => {
      this.closeModal()
      this.loadAgenda()
      this.toast?.show(false, 'Termini u fshi me sukses')
    })
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

  openModal({newAgenda, liftNumber, slot, doneModal}: {
    newAgenda: boolean,
    liftNumber?: number,
    slot?: any,
    doneModal: any
  }) {

    if (!newAgenda && localStorage.getItem('role') === 'user') {
      this.toast?.show(true, 'Roli juaj nuk mund te rezervoj termin')
      return
    }
    if (localStorage.getItem('role') === 'admin') {
      if (doneModal) {
        this.doneModals = true
      } else {
        this.isNewClient = true
        this.showModal = true;

      }
      if (liftNumber && slot) {
        for (const test of this.agenda) {
          for (const lift of test.lift) {
            if (lift.time.includes(slot) && lift.lift === liftNumber) {
              this.selectedLiftId = test._id
              this.car = lift.car;
              // @ts-ignore
              this.newCar = lift.car
              // @ts-ignore
              this.client = lift.client;
              // @ts-ignore
              this.newClient = lift.client
              this.description = lift.service;
              this.estimation = test.estimation
            }
          }
        }
      }
    } else {

      if (liftNumber && slot) {
        for (const test of this.agenda) {
          for (const lift of test.lift) {
            if (lift.time.includes(slot) && lift.lift === liftNumber) {
              this.selectedLiftId = test._id
              this.car = lift.car;
              // @ts-ignore
              this.newCar = lift.car
              // @ts-ignore
              this.client = lift.client;
              // @ts-ignore
              this.newClient = lift.client
              this.description = lift.service;
            }
          }
        }
      }
      if (doneModal) {
        this.doneModals = true
      } else {
        this.infoModal = true;
      }
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.infoModal = false
    this.finishWorkModal = false;
    this.doneModals = false;
    this.newClient = {_id: '', fullname: '', address: '', phone: '', email: ''};
    this.newCar = {make: '', model: '', year: '', engine: ''};
    this.description = ''
    this.estimation = ''
    this.selectedLiftId = null
  }

  async finishWork() {
    await this.service.editAgendaService(this.selectedLiftId).then(res => {
      if (res.status === 201) {
        this.toast?.show(false, 'Puna perfundoj me sukses')
        this.loadAgenda()
        this.closeModal()
      }
    })
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

  showAgenda(liftNumber: any, slot: any): string {
    for (const test of this.agenda) {
      for (const lift of test.lift) {
        if (lift.time.includes(slot) && lift.lift === liftNumber) {
          return lift.service + '--' + lift.client?.fullname
        }
      }
    }
    return 'Lir'
  }

  isDoneAgenda(liftNumber: any, slot: any): boolean {
    for (const agenda of this.agenda) {
      for (const lift of agenda.lift) {
        if (lift.time.includes(slot) && lift.lift === liftNumber && lift.status === 'Done') {
          return true
        }
      }
    }
    return false
  }
}
