export class Payments {
  constructor(
    public id: string,
    public userId: string, // client Ids
    public bookingId: string,
    public datePaid: string,
    public isPaid: boolean
  ) {}
}
