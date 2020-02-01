import { Component, OnInit } from '@angular/core';
import { BookingsService } from '../../bookings.service';
import { Observable, of } from 'rxjs';
import { Bookings } from '../../bookings';
import { switchMap } from 'rxjs/operators';
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
    if (this.booking$) {
      this.isLoading = false;
    }
    this.schedule = this.getSchedule();
    if (this.schedule) {
      // this.datePicked = new Date(schedule.datePicked).toISOString();
      // this.timePicked = new Date(schedule.timePicked).toISOString();
      // console.log(this.datePicked);
      // console.log(this.timePicked);
      this.activeNext = true;
    }
  }

  onSetSchedule(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const data = {
      datePicked: new Date(form.value.datePicked).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      }),
      timePicked: new Date(form.value.timePicked).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    this.setSchedule(data);
  }

  onNext(target: string) {
    this.navCtrl.navigateBack('/t/bookings/booking-create/' + target);
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
