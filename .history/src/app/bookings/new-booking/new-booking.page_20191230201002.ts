import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-booking',
  templateUrl: './new-booking.page.html',
  styleUrls: ['./new-booking.page.scss'],
})
export class NewBookingPage implements OnInit {
  selectedSegment: string;

  constructor() {
    this.selectedSegment = 'location';
  }

  ngOnInit() {
  }

  segmentChanged(ev: any) {
    this.selectedSegment = ev.detail.value;
  }
}
