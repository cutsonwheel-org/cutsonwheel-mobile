import { Component, OnInit } from '@angular/core';
import { BookingsService } from '../../bookings.service';
import { Observable, of } from 'rxjs';
import { Bookings } from '../../bookings';
import { switchMap } from 'rxjs/operators';
import { UsersService } from 'src/app/users/users.service';

interface Assistant {
  assisstantId: string;
  selectedServices: any[];
  subTotal: number;
}
@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {
  public assistant: Assistant;
  public booking$: Observable<Bookings[]>;
  public isLoading: boolean;
  public bookings: Bookings;

  constructor(
    private bookingsService: BookingsService,
    private usersService: UsersService
  ) {
    this.isLoading = true;
   }

  ngOnInit() {
    this.assistant = this.getAssistant();

    this.bookingsService.getByAssistantId(this.assistant.assisstantId, 'pending').pipe(
      switchMap(booking => {
        if (booking) {
          this.bookings = booking;
          return this.usersService.getUser(booking.userId);
        } else {
          return of(null);
        }
      })
    ).subscribe((user) => {
      this.isLoading = false;
      console.log(user);
    });
  }

  private getAssistant() {
    return JSON.parse(localStorage.getItem('assistant'));
  }
}
