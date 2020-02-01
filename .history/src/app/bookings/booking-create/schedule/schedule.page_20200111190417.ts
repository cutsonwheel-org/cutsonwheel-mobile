import { Component, OnInit } from '@angular/core';
import { BookingsService } from '../../bookings.service';
import { Observable, of, forkJoin } from 'rxjs';
import { Bookings } from '../../bookings';
import { switchMap, map, mergeMap } from 'rxjs/operators';
import { UsersService } from 'src/app/users/users.service';
import { NgForm } from '@angular/forms';
import { NavController } from '@ionic/angular';

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
  activeNext: boolean;
  schedule: Schedule;
  bookingData: any;

  constructor(
    private bookingsService: BookingsService,
    private usersService: UsersService,
    private navCtrl: NavController
  ) {
    this.isLoading = true;
    this.activeNext = false;
   }

  ngOnInit() {
    this.assistant = this.getAssistant();
    this.booking$ = this.bookingsService.getByAssistantId(this.assistant.assisstantId, 'pending');

    // this.bookingsService.getByAssistantId(this.assistant.assisstantId, 'pending').pipe(
    //   map( booking => {
    //     this.bookings = booking;
    //     return booking;
    //   }),
    //   mergeMap( booking => {
    //     if (booking.userId) {
    //       const client = this.usersService.getUser(booking.userId);
    //       return forkJoin([client]);
    //     } else {
    //       return of(null);
    //     }
    //   })
    // ).subscribe((booking) => {
    //   console.log(booking);
    //   this.isLoading = false;
    //   if (booking) {
    //     // const client = booking[0];
    //     // this.bookingData = {
    //     //   client,
    //     //   ...this.bookings
    //     // };
    //   }
    //   // console.log(this.bookingData);
    // });

    this.schedule = this.getSchedule();
    if (this.schedule) {
      this.activeNext = true;
    }
  }

  onSetSchedule(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const currenctTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const data = {
      datePicked: new Date(form.value.datePicked).toLocaleDateString(undefined, {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }),
      timePicked: new Date(form.value.timePicked).toLocaleTimeString(undefined, {
        timeZone: currenctTimeZone,
        hour12 : true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    };
    this.setSchedule(data);
  }

  onNext(target: string) {
    this.navCtrl.navigateBack('/t/bookings/booking-create/' + target);
  }

  private setSchedule(scheduled: Schedule) {
    localStorage.setItem('schedule', JSON.stringify(scheduled));
    this.onNext('review');
  }

  private getSchedule() {
    return JSON.parse(localStorage.getItem('schedule'));
  }

  private getAssistant() {
    return JSON.parse(localStorage.getItem('assistant'));
  }
}
