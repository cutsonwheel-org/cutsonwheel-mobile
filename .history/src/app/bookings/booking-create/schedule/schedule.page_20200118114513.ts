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
  public schedule: Date;
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
              // const sd = new Date(b.schedule.datePicked);
              // const y = sd.getFullYear();
              // const m = new Misc().pad(sd.getMonth() + 1);
              // const d = new Misc().pad(sd.getDate());
              // const datePicked = y + '-' + m + '-' + d;
              // const timePicked = b.schedule.timePicked;
              // const scheduleDate = new Date(datePicked + 'T' + timePicked);
              return {
                id: b.id,
                assistant: b.assistant,
                location: b.location,
                schedule: b.schedule,
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
    // if (this.schedule) {
    //   this.activeNext = true;

    //   const timePicked = this.schedule.timePicked;
    //   const scheduleDate = new Date(this.schedule.datePicked);
    //   // merge date and time
    //   this.pickedSchedule = new Misc().mergeDateTime(scheduleDate, timePicked).toISOString();
    // }
  }

  // private getPickedSchedule() {
  //   // get schedule
  //   this.scheduleSub = this.getSchedule()
  //     .subscribe((schedule) => {
  //       if (schedule) {
  //         this.activeNext = true;

  //         const timePicked = schedule.timePicked;
  //         const scheduleDate = new Date(schedule.datePicked);
  //         // merge date and time
  //         this.pickedSchedule = new Misc().mergeDateTime(scheduleDate, timePicked).toISOString();
  //       }
  //     }
  //   );
  // }

  // private getPickedAssistant() {
  //   this.assistantSub = this.getAssistant().subscribe((assistant) => {
  //     this.assistant = assistant;
  //   });
  // }

  onSetSchedule(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const currenctTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // const data = {
    //   datePicked: new Date(form.value.datePicked).toLocaleDateString(undefined, {
    //     day: '2-digit',
    //     month: '2-digit',
    //     year: '2-digit'
    //   }),
    //   timePicked: new Date(form.value.timePicked).toLocaleTimeString(undefined, {
    //     timeZone: currenctTimeZone,
    //     hour12 : false,
    //     hour: '2-digit',
    //     minute: '2-digit',
    //     second: '2-digit'
    //   })
    // };

    const timePicked = new Date(form.value.timePicked).toLocaleTimeString(undefined, {
      timeZone: currenctTimeZone,
      hour12 : false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    const scheduleDate = new Date(form.value.datePicked).toLocaleDateString(undefined, {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
    const pickedSchedule = new Misc().mergeDateTime(scheduleDate, timePicked);

    this.setSchedule(pickedSchedule);
  }

  onNext(target: string) {
    this.navCtrl.navigateBack('/t/bookings/booking-create/' + target);
  }

  private setSchedule(scheduled: Date) {
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
    this.scheduleSub.unsubscribe();
  }
}
