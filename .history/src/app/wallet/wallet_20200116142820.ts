export class Wallet {
  constructor(
    public paymentId: string,
    public paymentFrom: Date,
    public paymentTo: Date,
    public paymentDate: Date
  ) {}
}
