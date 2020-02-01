import { Component, OnInit } from '@angular/core';
import { BookingsService } from '../../bookings.service';
import { Observable, of } from 'rxjs';
import { Bookings } from '../../bookings';
import { switchMap } from 'rxjs/operators';
import { UsersService } from 'src/app/users/users.service';
import { NgForm } from '@angular/forms';

interface Assistant {
  assisstantId: string;
  selectedServices: any[];
  subTotal: number;
}

interface Schedule {
  datePicked: string;
  timePicked: string;
}
@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {
  public assistant: Assistant;
  public booking$: Observable<Bookings[]>;
  public bookings: Bookings;
  public isLoading: boolean;
  public date: string = new Date().toISOString();
  datePicked: string;
  timePicked: string;

  constructor(
    private bookingsService: BookingsService,
    private usersService: UsersService
  ) {
    this.isLoading = true;
   }

  ngOnInit() {
    this.assistant = this.getAssistant();
    this.booking$ = this.bookingsService.getByAssistantId(this.assistant.assisstantId, 'pending');
    // this.bookingsService.getByAssistantId(this.assistant.assisstantId, 'pending').pipe(
    //   switchMap(booking => {
    //     if (booking) {
    //       this.bookings = booking;
    //       return this.usersService.getUser(booking.userId);
    //     } else {
    //       return of(null);
    //     }
    //   })
    // ).subscribe((user) => {
    //   this.isLoading = false;
    //   console.log(user);
    // });
  }

  onSetSchedule(form: NgForm) {
    if (!form.valid) {
      return;
    }
    console.log(form.value);
    // const data = {
    //   datePicked: new Date(form.value.datePicked).toLocaleDateString(undefined, {
    //     day: 'numeric',
    //     month: 'numeric',
    //     year: 'numeric'
    //   }),
    //   timePicked: new Date(form.value.timePicked).toLocaleTimeString(undefined, {
    //     hour: '2-digit',
    //     minute: '2-digit'
    //   })
    // };
    // this.setSchedule(data);
  }

  private setSchedule(scheduled: Schedule) {
    localStorage.setItem('schedule', JSON.stringify(scheduled));
  }

  private getSchedule() {
    return JSON.parse(localStorage.getItem('schedule'));
  }

  private getAssistant() {
    return JSON.parse(localStorage.getItem('assistant'));
  }
}
