
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
  referenceId: string;
  from: string;
  to: string;
}

export class Payments {
    constructor(
      public id: string,
      public intent: string,
      public payer: Payer,
      public transactions: Transaction,
      public note: string,
      public created: Date
    ) {}
  }
