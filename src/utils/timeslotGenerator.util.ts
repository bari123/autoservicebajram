import {Timeslot} from "./models/models.util";

export function generateTimeslots():Timeslot[] {
  const timeslots = [];
  for (let hour = 8; hour <= 17; hour++) {
    const time = `${hour.toString().padStart(2, '0')}:00`;
    timeslots.push({ time, reserved: false ,value:''});
  }
  return timeslots;
}
