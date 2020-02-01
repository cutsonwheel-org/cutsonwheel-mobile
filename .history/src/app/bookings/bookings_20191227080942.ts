export class Bookings {
  constructor(
    public id: string,
    public offerId: string,
    public userId: string,
    public offerTitle: string,
    public offerImage: string,
    public firstName: string,
    public lastName: string,
    public guestNumber: number,
    public bookedFrom: Date,
    public bookedTo: Date
  ) {}
}
