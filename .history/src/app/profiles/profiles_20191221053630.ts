import { PlaceLocation } from '../places/location';

export class Profiles {
    constructor(
      public id: string,
      public firstname: string,
      public lastname: string,
      public dateOfBirth: Date,
      public avatarUrl: string,
      public userId: string,
      public location: PlaceLocation
      ) {}
}
