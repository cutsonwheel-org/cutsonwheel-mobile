import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookingsService } from '../../bookings.service';
import { Bookings } from '../../bookings';
import { NgForm } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Misc } from './../../../shared/class/misc';
import { map } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';

interface Assistant {
  assistantId: string;
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
export class SchedulePage implements OnInit, OnDestroy {
  public assistant: Assistant;
  public bookings: Bookings;
  public isLoading: boolean;
  public schedule: Schedule;
  public activeNext: boolean;
  public pickedSchedule: string;
  bookingLength: number;

  private bookingSub: Subscription;
  private assistantSub: Subscription;
  private scheduleSub: Subscription;

  constructor(
    private bookingsService: BookingsService,
    private navCtrl: NavController,
  ) {
    this.isLoading = true;
    this.activeNext = false;
   }

  ngOnInit() {
    // seg assistant
    this.assistant = this.getAssistant();
    // get bookings
    this.bookingSub = this.bookingsService.getByAssistantId(this.assistant.assistantId, 'pending').pipe(
      map(booking => {
        return {
          bookings: booking.map(
            b => {
              return {
                id: b.id,
                assistant: b.assistant,
                location: b.location,
                schedule: b.schedule,
                formattedDate: b.formattedDate,
                status: b.status,
                userId: b.userId
              };
            }
          )
        };
      })
    ).subscribe((response) => {
      this.isLoading = false;
      this.bookings = response.bookings;
      this.bookingLength = response.bookings.length;
    });

    // get schedule
    this.schedule = this.getSchedule();
    if (this.schedule) {
      this.activeNext = true;

      const timePicked = this.schedule.timePicked;
      const scheduleDate = new Date(this.schedule.datePicked);
      // merge date and time
      this.pickedSchedule = new Misc().mergeDateTime(scheduleDate, timePicked).toISOString();
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
        hour12 : false,
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

  ngOnDestroy() {
    this.bookingSub.unsubscribe();
  }
}
