import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PlaceLocation } from 'src/app/services/location';

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

  constructor(
    private navCtrl: NavController
  ) {
    this.activeNext = false;
  }

  ngOnInit() {
    this.location = this.getLocation();
    this.assistant = this.getAssistant();
    this.schedule = this.getSchedule();
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
