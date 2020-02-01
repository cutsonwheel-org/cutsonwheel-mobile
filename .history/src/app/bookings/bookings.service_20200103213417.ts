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
  ) {}

  getBookingData(collection: AngularFirestoreCollection): Observable<any> {
    return collection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getBookingsByClient(clientId: string) {
    const collection$ = this.afs.collection<Bookings>('bookings', ref =>
      ref.orderBy('status', 'asc').where('userId', '==', clientId)
    );
    return this.getBookingData(collection$);
  }

  getBookingsByAssistant(assistantId: string) {
    const collection$ = this.afs.collection<Bookings>('bookings', ref =>
      ref.orderBy('status', 'asc').where('assistant.assisstantId', '==', assistantId)
    );
    return this.getBookingData(collection$);
  }

  populateBookings() {
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

  getBookings(): Observable<Bookings[]> {
    return this.bookings;
  }

  getBookingByUserId(userId: string) {
    return this.bookings.pipe(
      map(bookings =>
        bookings.filter((booking) => {
          return booking.userId.indexOf(userId) > -1;
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


}
