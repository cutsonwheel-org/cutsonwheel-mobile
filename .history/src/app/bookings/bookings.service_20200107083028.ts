import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Bookings } from './bookings';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreCollection, AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { auth } from 'firebase/app';
declare var gapi: any;

const hoursFromNow = (n) => new Date(Date.now() + n * 1000 * 60 * 60 ).toISOString();

@Injectable({ providedIn: 'root' })
export class BookingsService {
  private bookings: Observable<Bookings[]>;
  private bookingsCollection: AngularFirestoreCollection<Bookings>;

  user$: Observable<firebase.User>;
  calendarItems: any[];

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private afs: AngularFirestore,
    private angularFireAuth: AngularFireAuth
  ) {
    this.bookingsCollection = this.afs.collection<Bookings>('bookings');
    // this.initClient();
    // this.user$ = angularFireAuth.authState;
  }

  initClient() {
    gapi.load('client', () => {
      console.log('loaded client');

      gapi.client.init({
        apiKey: 'AIzaSyC1P3bJSJZpzs7cd0QoizMEkkZqCqMCFCs',
        clientId: '504496906586-onu8ilu9tp5ehvnmj6ogqvudlislrbkh.apps.googleusercontent.com',
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar'
      });

      gapi.client.load('calendar', 'v3', () => {
        console.log('loaded calendar');
        this.getCalendar();
      });
    });
  }

  async getCalendar() {
    const events = await gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: 'startTime'
    });

    console.log(events);

    this.calendarItems = events.result.items;
  }

  async insertEvent() {
    const insert = await gapi.client.calendar.events.insert({
      calendarId: 'primary',
      start: {
        dateTime: hoursFromNow(2),
        timeZone: 'UTC +8'
      },
      end: {
        dateTime: hoursFromNow(3),
        timeZone: 'UTC +8'
      },
      summary: 'test cutsonwheel',
      description: 'Do some cool stuff and have fun.'
    });
    await this.getCalendar();
  }

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

  updateStatus(booking: any): Promise<void> {
    return this.bookingsCollection.doc(booking.id).update({
      status: booking.status
    });
  }

  deleteBooking(id: string): Promise<void> {
    return this.bookingsCollection.doc(id).delete();
  }


}
