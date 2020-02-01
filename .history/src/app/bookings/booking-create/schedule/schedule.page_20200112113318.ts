import { Component, OnInit } from '@angular/core';
import { BookingsService } from '../../bookings.service';
import { Observable } from 'rxjs';
import { Bookings } from '../../bookings';
import { UsersService } from 'src/app/users/users.service';
import { NgForm } from '@angular/forms';
import { NavController, ModalController } from '@ionic/angular';
import { Misc } from './../../../shared/class/misc';
import { map } from 'rxjs/operators';

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

  pickedSchedule: string;

  constructor(
    private bookingsService: BookingsService,
    private usersService: UsersService,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) {
    this.isLoading = true;
    this.activeNext = false;
   }

  ngOnInit() {
    this.assistant = this.getAssistant();
    // .pipe(
    //   map(userData => {
    //     return { users: userData.users.map(user => {
    //       return {
    //         id: user._id,
    //         firstname: user.firstname,
    //         midlename: user.midlename,
    //         lastname: user.lastname,
    //         contact: user.contact,
    //         gender: user.gender,
    //         birthdate: user.birthdate,
    //         address: user.address,
    //         philhealth: user.philhealth,
    //         sss: user.sss,
    //         status: user.status,
    //         tin: user.tin,
    //         created: user.createdAt,
    //         updated: user.updatedAt,
    //         activated: user.activated,
    //         classification: user.classification,
    //         avatar: user.avatar
    //       };
    //     }), max: userData.counts};
    //   })
    // )

    this.bookingsService.getByAssistantId(this.assistant.assisstantId, 'pending').pipe(
      map(booking => {
        console.log(booking);
        return {
          bookings: booking.map(
            b => {
              return {
                id: b.id,
                assistant: b.assistant,
                location: b.location,
                schedule: new Misc().mergeDateTime(b.schedule.datePicked, b.schedule.timePicked),
                status: b.status,
                userId: b.userId
              };
            }
          )
        };
        // return new Misc().mergeDateTime(booking.schedule.datePicked, booking.schedule.timePicked).toISOString();
      })
    ).subscribe((bookings) => {
      console.log(bookings);
    });

    this.schedule = this.getSchedule();
    if (this.schedule) {
      this.activeNext = true;
      const timePicked = this.schedule.timePicked;
      const scheduleDate = new Date(this.schedule.datePicked);

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
}
