

export class Wallet {
  constructor(
    public id: string,
    public paymentId: string,
    public paymentFrom: Date,
    public paymentTo: Date,
    public paymentDate: Date,
    public formattedDate: Date
  ) {}
}
