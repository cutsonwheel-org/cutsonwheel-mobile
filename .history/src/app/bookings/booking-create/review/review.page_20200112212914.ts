import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PlaceLocation } from 'src/app/services/location';
import { UsersService } from 'src/app/users/users.service';
import { Users } from 'src/app/users/users';
import { Misc } from './../../../shared/class/misc';

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
  selector: 'app-review',
  templateUrl: './review.page.html',
  styleUrls: ['./review.page.scss'],
})
export class ReviewPage implements OnInit {
  activeNext: boolean;
  isEnableEdit: boolean;
  location: PlaceLocation;
  assistant: Assistant;
  schedule: Schedule;
  user: Users;
  endUntil: Date;
  formatedTime: string;

  mapping: {[k: string]: string} = {
    '=0': 'No services.',
    '=1': 'One service',
    other: '# services',
  };

  constructor(
    private navCtrl: NavController,
    private usersServce: UsersService
  ) {
    this.activeNext = false;
    this.isEnableEdit = false;
  }

  ngOnInit() {
    // get location
    this.location = this.getLocation();

    // get assistant
    this.assistant = this.getAssistant();
    this.usersServce.getUser(this.assistant.assisstantId).subscribe((user) => {
      this.user = user;
    });

    this.schedule = this.getSchedule();

    // total all item durations
    const services = this.assistant.selectedServices;
    let totalDuration = 0;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < services.length; i++) {
      totalDuration += parseInt(services[i].duration.replace(/[^0-9]/g, ''), 10);
    }

    // get client timezone
    const currenctTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const timePicked = this.schedule.timePicked;
    const scheduleDate = new Date(this.schedule.datePicked);

    // schedue transformation
    const pickedSchedule = new Misc().mergeDateTime(scheduleDate, timePicked);

    // set time format
    this.formatedTime = pickedSchedule.toLocaleString('en-US', {
      timeZone: currenctTimeZone,
      hour12 : true,
      hour: '2-digit',
      minute: '2-digit'
    });

    // add total duration
    pickedSchedule.setMinutes(pickedSchedule.getMinutes() + totalDuration);
    this.endUntil = pickedSchedule;
  }

  onNext(target: string) {
    this.navCtrl.navigateBack('/t/bookings/booking-create/' + target);
  }

  onEdit() {
    this.isEnableEdit = !this.isEnableEdit;
  }

  private getLocation() {
    return JSON.parse(localStorage.getItem('location'));
  }

  private getAssistant() {
    return JSON.parse(localStorage.getItem('assistant'));
  }

  private getSchedule() {
    return JSON.parse(localStorage.getItem('schedule'));
  }
}
