import { PlaceLocation } from '../services/location';

interface Schedule {
  datePicked: string;
  timePicked: string;
}

interface Assistant {
  assistantId: string;
  selectedServices: any[];
  subTotal: number;
}
export class Bookings {
  constructor(
    public id: string,
    public userId: string,
    public location: PlaceLocation,
    public assistant: Assistant,
    public schedule: Schedule,
    public status: string
  ) {}
}
