export class Wallet {
  constructor(
    public id: string,
    public paymentId: string,
    public from: Date,
    public to: Date,
  ) {}
}
