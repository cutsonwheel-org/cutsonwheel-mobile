import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { Bookings } from './bookings';
import { BookingsService } from './bookings.service';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { Router } from '@angular/router';
import { Users } from '../users/users';
import { map } from 'rxjs/operators';
import { Misc } from './../shared/class/misc';
@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss']
})
export class BookingsPage implements OnInit, OnDestroy {
  public isLoading = false;
  public users: Users;
  public selectedSegment: string;
  public loadedBookings: Bookings[];
  public length: number;

  private userSub: Subscription;
  private bookingSub: Subscription;

  constructor(
    private bookingService: BookingsService,
    private authService: AuthService,
    private userService: UsersService,
    private router: Router
  ) {
    this.selectedSegment = 'pending';
  }

  ngOnInit() {
    const currenctUser = this.authService.getUsersProfile();
    if (currenctUser) {
      this.userSub = this.userService.getUser(currenctUser.uid).subscribe((profile) => {
        this.users = profile;
        this.populateBookings(profile, 'pending');
      });
    }
  }

  private populateBookings(user: Users, status: string) {
    let bookings;
    if (user.roles.assistant) {
      /** assistant */
      bookings = this.getAssistantBookings(user.id, status);
    } else {
      /** client */
      bookings = this.getClientBookings(user.id, status);
    }

    this.bookingSub = bookings.subscribe((response) => {
      this.isLoading = false;
      this.loadedBookings = response.bookings;
      this.length = response.bookings.length;
    });
  }

  private getAssistantBookings(userId: string, status: string): Observable<any> {
    return this.bookingService.getByAssistantId(userId, status).pipe(
      map(booking => {
        return {
          bookings: booking.map(
            b => {
              const sd = new Date(b.schedule.datePicked);
              const y = sd.getFullYear();
              const m = new Misc().pad(sd.getMonth() + 1);
              const d = new Misc().pad(sd.getDate());
              const datePicked = y + '-' + m + '-' + d;
              const timePicked = b.schedule.timePicked;
              const scheduleDate = new Date(datePicked + 'T' + timePicked);
              return {
                id: b.id,
                assistant: b.assistant,
                location: b.location,
                schedule: scheduleDate,
                status: b.status,
                userId: b.userId
              };
            }
          )
        };
      })
    );
  }

  private getClientBookings(userId: string, status: string): Observable<any> {
    return this.bookingService.getByClientId(userId, status).pipe(
      map(booking => {
        return {
          bookings: booking.map(
            b => {
              const sd = new Date(b.schedule.datePicked);
              const y = sd.getFullYear();
              const m = new Misc().pad(sd.getMonth() + 1);
              const d = new Misc().pad(sd.getDate());
              const datePicked = y + '-' + m + '-' + d;
              const timePicked = b.schedule.timePicked;
              const scheduleDate = new Date(datePicked + 'T' + timePicked);
              return {
                id: b.id,
                assistant: b.assistant,
                location: b.location,
                schedule: scheduleDate,
                status: b.status,
                userId: b.userId
              };
            }
          )
        };
      })
    );
  }

  segmentChanged(ev: any, user: Users) {
    this.selectedSegment = ev.detail.value;
    this.populateBookings(user, ev.detail.value);
  }

  onViewBooking(bookingId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    this.router.navigateByUrl('/t/bookings/booking-detail/' + bookingId);
  }

  onCancel(event) {
    console.log(event);
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.bookingSub.unsubscribe();
  }
}
