import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, tap, delay, switchMap, map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Bookings } from './bookings';
import { HttpClient } from '@angular/common/http';

import { AngularFirestoreCollection, AngularFirestore, DocumentReference } from '@angular/fire/firestore';
interface BookingData {
  bookedFrom: string;
  bookedTo: string;
  firstName: string;
  guestNumber: number;
  lastName: string;
  placeId: string;
  placeImage: string;
  placeTitle: string;
  userId: string;
}

@Injectable({ providedIn: 'root' })
export class BookingsService {
  private bookings: Observable<Bookings[]>;
  private bookingsCollection: AngularFirestoreCollection<Bookings>;

  // private bookings$ = new BehaviorSubject<Bookings[]>([]);

  // get bookings() {
  //   return this.bookings$.asObservable();
  // }

  constructor(private authService: AuthService, private http: HttpClient) {}

  insertBooking(booking: any): Promise<DocumentReference> {
    return this.bookingsCollection.add(booking);
  }

  updateBooking(booking: any): Promise<void> {
    return this.bookingsCollection.doc(booking.id).update({
      title: booking.title,
      description: booking.description
    });
  }

  deletePlace(id: string): Promise<void> {
    return this.bookingsCollection.doc(id).delete();
  }

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let generatedId: string;
    let newBooking: Bookings;
    let fetchUserId: string;

    return this.authService.userId.pipe(take(1), switchMap(
      userId => {
      if (!userId) {
        throw new Error('No user id found!');
      }
      fetchUserId = userId;
      return this.authService.token;
    }),
    take(1),
    switchMap(token => {
      newBooking = new Bookings(
        Math.random().toString(),
        placeId,
        fetchUserId,
        placeTitle,
        placeImage,
        firstName,
        lastName,
        guestNumber,
        dateFrom,
        dateTo
      );
      return this.http.post<{name: string}>(
        `https://cutsonwheel-233209.firebaseio.com/bookings.json?auth=${token}`,
        { ...newBooking, id: null });
    }),
    switchMap(resData => {
      generatedId = resData.name;
      return this.bookings;
    }),
    take(1),
    tap(bookings => {
      newBooking.id = generatedId;
      this.bookings$.next(bookings.concat(newBooking));
    }));
  }

  cancelBooking(bookingId: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.delete(`https://cutsonwheel-233209.firebaseio.com/bookings/${bookingId}.json?auth=${token}`);
      }),
      switchMap(() => {
      return this.bookings;
      }),
      take(1),
      tap(bookings => {
        this.bookings$.next(bookings.filter(b => b.id !== bookingId));
      })
    );
  }

  fetchBookings() {
    let fetchUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
      if (!userId) {
        throw new Error('User not found');
      }
      fetchUserId = userId;
      return this.authService.token;
    }),
    take(1),
    switchMap(token => {
      return this.http.get<{ [key: string]: BookingData }>(
        `https://cutsonwheel-233209.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${fetchUserId}"&auth=${token}`
      );
    }),
      map(bookingData => {
        const bookings = [];
        for (const key in bookingData) {
          if (bookingData.hasOwnProperty(key)) {
            bookings.push(
              new Bookings(
                key,
                bookingData[key].placeId,
                bookingData[key].userId,
                bookingData[key].placeTitle,
                bookingData[key].placeImage,
                bookingData[key].firstName,
                bookingData[key].lastName,
                bookingData[key].guestNumber,
                new Date(bookingData[key].bookedFrom),
                new Date(bookingData[key].bookedTo)
              )
            );
          }
        }
        return bookings;
      }),
      tap(bookings => {
        this.bookings$.next(bookings);
      })
    );
  }
}
