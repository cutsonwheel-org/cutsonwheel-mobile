import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Bookings } from './bookings';
import { HttpClient } from '@angular/common/http';

import { AngularFirestoreCollection, AngularFirestore, DocumentReference } from '@angular/fire/firestore';
@Injectable({ providedIn: 'root' })
export class BookingsService {
  private bookings: Observable<Bookings[]>;
  private bookingsCollection: AngularFirestoreCollection<Bookings>;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private afs: AngularFirestore
  ) {
    this.bookingsCollection = this.afs.collection<Bookings>('bookings');
    this.bookings = this.bookingsCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getBookings(searchKey: string): Observable<Bookings[]> {
    return this.bookings.pipe(
      map(bookings =>
        bookings.filter((booking) => {
          return booking.offerTitle.indexOf(searchKey) > -1;
        })
      )
    );
  }

  getBooking(id: string): Observable<Bookings> {
    return this.bookingsCollection.doc<Bookings>(id).valueChanges().pipe(
      take(1),
      map(booking => {
        booking.id = id;
        return booking;
      })
    );
  }

  insertBooking(booking: any): Promise<DocumentReference> {
    return this.bookingsCollection.add(booking);
  }

  updateBooking(booking: any): Promise<void> {
    return this.bookingsCollection.doc(booking.id).update({
      title: booking.title,
      description: booking.description
    });
  }

  deleteBooking(id: string): Promise<void> {
    return this.bookingsCollection.doc(id).delete();
  }

  paymentProcess() {
    const token = 'EAAAEIKOwP4ojSpukxBGfuBhhD8eHp7OG5dIR4II9x5MmfcJtCBb35Q1toPQaVjS';
    const locationId = 'cutsonwheel';
    const paymentData = {
      idempotency_key: '86ae1696-b1e3-4328-af6d-f1e04d947ad6',
      order: {
        reference_id: '12345',
        line_items: [
          {
            name: 'Printed T Shirt',
            quantity: 2,
            base_price_money: {
              amount: 1500,
              currency: 'USD'
            },
            discounts: [
              {
                name: '7% off previous season item',
                percentage: 7
              },
              {
                name: '$3 off Customer Discount',
                amount_money: {
                  amount: 300,
                  currency: 'USD'
                }
              }
            ]
          }
        ]
      },
      ask_for_shipping_address: true,
      merchant_support_email: 'merchant+support@website.com',
      pre_populate_buyer_email: 'example@email.com',
      pre_populate_shipping_address: {
        address_line_1: '1455 Market St.',
        address_line_2: 'Suite 600',
        locality: 'San Francisco',
        administrative_district_level_1: 'CA',
        postal_code: 94103,
        country: 'US',
        first_name: 'Jane',
        last_name: 'Doe'
      },
      redirect_url: 'https://merchant.website.com/order-confirm'
    };
    const res = this.http.post<{response: any}>(
      'https://connect.squareup.com/v2/locations/' + locationId + '/checkouts',
      paymentData,
      {
        headers: {
          'Square-Version': '2019-12-17',
          Authorization: 'Bearer ' + token
        }
      }
    );

    console.log(res);
  }
}
