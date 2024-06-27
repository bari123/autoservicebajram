export interface ItemsModel {
  _id: string,
  name: string,
  price: number,
  serialCode: string,
  qnt: number,
  shelfNumber: string,
  description: string,
  engineType: string,
  carAndYear: string,
  originalQty: number
}

export interface CarModel {
  model: string,
  make: string,
  _id?: string,
  year: string,
  engine: string
}

export interface Client {
  _id: string;
  fullname: string;
  address: string;
  phone: string;
  email: string;
}

export interface Car {
  make: string;
  model: string;
  year: string;
  engine: string;
}

export interface Timeslot {
  time: string;
  reserved: boolean;
  value:string
}

export interface Lift {
  service: string | null;
  client: Client | null;
  car: Car | null;
  time: string[];
  lift: number;
  timeslots: Timeslot[];
  status: string;
}

export interface AgendaSlot {
  _id: string;
  lift: Lift[];
  client: Client;
  car: Car;
  service: string;
  status: string
  estimation: string
  date?: string
}

export interface ModalModel {
  newAgenda: boolean,
  liftNumber?: number,
  slot?: any,
  doneModal: any
}
