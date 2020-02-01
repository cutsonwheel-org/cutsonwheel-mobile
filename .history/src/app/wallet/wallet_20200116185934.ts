export interface Timestamp {
  seconds: number;
  nanoseconds: number;
}

export class Wallet {
  constructor(
    // public id: string,
    public paymentId: string,
    public paymentFrom: Date,
    public paymentTo: Date,
    public paymentDate: Timestamp,
    public formattedDate: Date
  ) {}
}
