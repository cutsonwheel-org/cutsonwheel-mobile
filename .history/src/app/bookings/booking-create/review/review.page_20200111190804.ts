import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PlaceLocation } from 'src/app/services/location';
import { UsersService } from 'src/app/users/users.service';
import { Users } from 'src/app/users/users';

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
  selector: 'app-review',
  templateUrl: './review.page.html',
  styleUrls: ['./review.page.scss'],
})
export class ReviewPage implements OnInit {
  activeNext: boolean;
  location: PlaceLocation;
  assistant: Assistant;
  schedule: Schedule;
  user: Users;
  endUntil: string;

  mapping: {[k: string]: string} = {
    '=0': 's',
    '=1': '',
    other: 's',
  };

  constructor(
    private navCtrl: NavController,
    private usersServce: UsersService
  ) {
    this.activeNext = false;
  }

  ngOnInit() {
    this.location = this.getLocation();
    this.assistant = this.getAssistant();
    this.usersServce.getUser(this.assistant.assisstantId).subscribe((user) => {
      this.user = user;
    });
    this.schedule = this.getSchedule();
    const time = this.schedule.timePicked;
    console.log(time);
    const scheduleDate = new Date(this.schedule.datePicked).toLocaleDateString();
    console.log(scheduleDate);
    // scheduleDate.setMinutes(scheduleDate.getMinutes() + 30);
    // console.log(scheduleDate);
    // this.endUntil

    // var timeString = time.getHours() + ':' + time.getMinutes() + ':00';
    // var ampm = time.getHours() >= 12 ? 'PM' : 'AM';
    // var year = date.getFullYear();
    // var month = date.getMonth() + 1; // Jan is 0, dec is 11
    // var day = date.getDate();
    // var dateString = '' + year + '-' + month + '-' + day;
    // var datec = dateString + 'T' + timeString;
    // var combined = new Date(datec);

    // return combined;
  }

  onNext(target: string) {
    this.navCtrl.navigateBack('/t/bookings/booking-create/' + target);
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
