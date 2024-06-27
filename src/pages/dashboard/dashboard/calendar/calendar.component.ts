import {Component, OnInit} from '@angular/core';
import {GlobalService} from '../../../../app/global.service';
import * as moment from "moment";
import {ToasterService} from "../../../compo/toaster/toaster.service";
import {AgendaSlot, Car, Client, Lift, ModalModel} from 'src/utils/models/models.util';
import {generateTimeslots} from "../../../../utils/timeslotGenerator.util";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css', '../../../../styles.css']
})
export class CalendarComponent implements OnInit {
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
  currentDate: moment.Moment = moment()
  isNewClient = false;
  estimation = ''
  showModal = false;
  finishWorkModal = false;
  doneModals = false
  infoModal = false;
  client: Client = {_id: '', fullname: '', address: '', phone: '', email: ''};
  car: Car | null = null;
  lifts: Lift[] = [];

  constructor(private service: GlobalService, private toaster: ToasterService) {
  }

  async ngOnInit() {
    await this.loadAgenda();
    await this.loadClients();
    this.initializeLifts();
  }

  async selectedDate(date: moment.Moment) {
    this.currentDate = date
    await this.loadAgenda()
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
      await this.service.saveAgenda(this.selectedSlot, this.selectedLift, this.selectedClient, this.newCar, this.description, this.newClient, this.currentDate.toDate().toLocaleDateString(), estimation, this.selectedLiftId);
    }
    this.description = null
    this.toaster.showToast(false, 'Termini u rezervua me sukses')
    this.closeModal()
    await this.loadAgenda()
  }

  async deleteAgenda() {
    await this.service.deleteAgenda(this.selectedLiftId).then(() => {
      this.closeModal()
      this.loadAgenda()
      this.toaster.showToast(false, 'Termini u fshi me sukses')
    })
  }


  async loadAgenda() {
    this.agenda = await this.service.getAgenda(this.currentDate.toDate().toLocaleDateString());
    this.initializeLifts();
    this.agenda.forEach(lift =>
      lift.lift.forEach(slot =>
        this.updateReservedStatus(slot.lift, slot.time, true)
      )
    );
  }

  initializeLifts(): void {
    // @ts-ignore
    this.lifts = Array.from({length: 4}, (_, index) => ({
      lift: index + 1,
      timeslots: generateTimeslots()
    }));
  }


  openModal({newAgenda, liftNumber, slot, doneModal}: ModalModel) {
    const role = localStorage.getItem('role');
    if (role === 'user' && !newAgenda) {
      this.toaster.showToast(true, 'Roli juaj nuk mund te rezervoj termin');
      return;
    }
    if (role === 'admin') {
      this.isNewClient = true;
      this.showModal = !doneModal;
      this.doneModals = doneModal;
    } else {
      this.infoModal = !doneModal;
      this.doneModals = doneModal;
    }
    this.setModalValues(liftNumber, slot);

  }

  closeModal(): void {
    this.showModal = this.infoModal = this.finishWorkModal = this.doneModals = false;
    this.resetForm();
  }

  async finishWork() {
    const res = await this.service.editAgendaService(this.selectedLiftId!);
    if (res.status === 201) {
      this.toaster.showToast(false, 'Puna perfundoj me sukses');
      await this.loadAgenda();
      this.closeModal();
    }
  }

  toggleClientSelection(): void {
    this.isNewClient = !this.isNewClient;
  }

  private updateReservedStatus(liftNumber: number, times: string[], newReservedStatus: boolean): void {
    const lift = this.lifts.find(lift => lift.lift === liftNumber);
    lift?.timeslots.forEach(slot => {
      if (times.includes(slot.time)) slot.reserved = newReservedStatus;
    });
  }

  testFunc(data: any) {
    this.selectedLift = data.liftIndex;
    this.selectedSlot = [data.slot.time]
    this.openModal({
      newAgenda: data.slot.reserved,
      liftNumber: data.liftIndex,
      slot: data.slot,
      doneModal: this.isDoneAgenda(data.liftIndex, data.slot.time)
    })
  }

  isDoneAgenda(liftNumber: any, slot: any): boolean {
    return this.agenda.some((agenda: { lift: { time: string | any[]; lift: any; status: string; }[]; }) =>
      agenda.lift.some((lift: { time: string | any[]; lift: any; status: string; }) =>
        lift.time.includes(slot) && lift.lift === liftNumber && lift.status === 'Done'
      )
    );
  }

  async newTimeslot(event: any) {
    const liftNumber = event.lift;
    const oldLift = event.oldLift
    const updatedTimeslots = event.timeslots;
    let date
    const slots = updatedTimeslots.filter((res: { reserved: any; }) => res.reserved)
    this.selectedSlot = slots.map((res: { time: any; }) => res.time)
    this.selectedLift = liftNumber
    for (const test of this.agenda) {
      for (const lift of test.lift) {
        if (lift.lift === liftNumber || lift.lift === oldLift) {
          date = test.date
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
    //@ts-ignore
    await this.service.saveAgendaDrop(this.selectedLiftId, this.selectedSlot, this.selectedLift, this.selectedClient, this.newCar, this.description, this.newClient, date, this.estimation);


  }


  private createEmptyClient(): Client {
    return {_id: '', fullname: '', address: '', phone: '', email: ''};
  }

  private createEmptyCar(): Car {
    return {make: '', model: '', year: '', engine: ''};
  }


  private resetForm(): void {
    this.newClient = this.createEmptyClient();
    this.newCar = this.createEmptyCar();
    this.description = null;
    this.estimation = '';
    this.selectedLiftId = null;
  }

  private setModalValues(liftNumber: any, slot: any) {
    const agendaItem = this.agenda.find(agenda =>
      agenda.lift.some(lift => lift.lift === liftNumber && lift.time.includes(slot.time))
    )
    const liftItem = agendaItem?.lift.find(lift => lift.lift === liftNumber && lift.time.includes(slot.time));
    if (agendaItem && liftItem) {
      this.selectedLiftId = agendaItem._id;
      // @ts-ignore
      this.newCar = liftItem.car;
      // @ts-ignore
      this.newClient = liftItem.client;
      this.description = liftItem.service;
      this.estimation = agendaItem.estimation;
    }

  }

}

