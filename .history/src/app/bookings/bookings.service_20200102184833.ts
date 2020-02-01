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
    const paymentData = {
      idempotency_key: '4935a656-a929-4792-b97c-8848be85c27c',
      amount_money: {
        amount: 200,
        currency: 'USD'
      },
      source_id: 'ccof:uIbfJXhXETSP197M3GB',
      autocomplete: true,
      customer_id: 'VDKXEEKPJN48QDG3BGGFAK05P8',
      location_id: 'XK3DBG77NJBFX',
      reference_id: '123456',
      note: 'Brief description',
      app_fee_money: {
        amount: 10,
        currency: 'USD'
      }
    };
    return this.http.post<{response: any}>(
      'https://connect.squareup.com/v2/payments',
      paymentData,
      {
        headers: {
          'Square-Version': '2019-12-17',
          Authorization: 'Bearer ' + token
        }
      }
    );
  }
}
