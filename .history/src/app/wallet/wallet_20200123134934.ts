export class Wallet {
  constructor(
    public id: string,
    public amount: string,
    public currency: string,
    public paymentCenter: string,
    public created: Date,
    public createdTransformed: Date,
    public paymentFrom: string, // login user
    public paymentRefNum: string,
    public paymentRefImageUrl: string
  ) {}
}
