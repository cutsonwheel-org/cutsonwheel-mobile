

export class Wallets {
  constructor(
    public id: string,
    public paymentId: string,
    public paymentFrom: string,
    public paymentTo: string,
    public paymentDate: string,
    public formattedDate: string
  ) {}
}
