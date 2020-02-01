

export class Wallet {
  constructor(
    public id: string,
    public paymentId: string,
    public paymentFrom: string,
    public paymentTo: Date,
    public paymentDate: string,
    public formattedDate: Date
  ) {}
}
