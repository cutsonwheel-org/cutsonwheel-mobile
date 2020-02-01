// import { PlaceLocation } from '../services/location';

export class Users {
  constructor(
    public id: string,
    public firstname: string,
    public lastname: string,
    public photoURL: string,
    public displayName: string,
    public phoneNumber: string,
    public address: string
  ) {}
}
