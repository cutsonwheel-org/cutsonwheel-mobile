
export interface Amount {
  total: number;
  currency: string;
}

export interface Payer {
  paymentMethod: string;
}

export interface Items {
  name: string;
  description: string;
  quantity: number;
  price: number;
  currency: string;
}

export interface ShippingAddress {
  recipientName: string;
  address: string;
}

export interface ItemList {
  items: Items;
  shippingAddress: ShippingAddress;
}

export interface Transaction {
  amount: Amount;
  description: string;
  invoiceNumber: number;
  itemList: ItemList;
}

export class Payments {
    constructor(
      public id: string,
      public intent: string,
      public payer: Payer,
      public transactions: Transaction,
      public paymentCreated: Date,
      public paymentCreatedTransformed: Date,
      public paymentTo: string,
      public isValid: boolean,
      public note?: string,
      public paymentFrom?: string
    ) {}
  }
