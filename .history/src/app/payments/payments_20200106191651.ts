import { Bookings } from '../bookings/bookings';

interface Amount {
  total: number;
  currency: string;
}

interface Payer {
  paymentMethod: string;
}

interface Items {
  name: string;
  description: string;
  quantity: number;
  price: number;
  currency: string;
}

interface ShippingAddress {
  recipientName: string;
  address: string;
}

interface ItemList {
  items: Items;
  shippingAddress: ShippingAddress;
}

interface Transaction {
  amount: Amount;
  description: string;
  invoiceNumber: number;
  itemList: ItemList;
}

export class Payments {
    constructor(
      public id: string,
      public bookings: Bookings,
      public intent: string,
      public payer: Payer,
      public transactions: Transaction,
      public note: string,
      public created: Date
    ) {}
  }
