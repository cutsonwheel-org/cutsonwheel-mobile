import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Offers } from './../../services/offers/offers';


@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss']
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedOffer: Offers;
  @ViewChild('f', { static: false }) form: NgForm;
  date: string = new Date().toISOString();
  datePicked: string;
  timePicked: string;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onBookOffer() {
    if (!this.form.valid) {
      return;
    }
    // 2020-01-02T03:35:27.900Z
    // 1990-02-19T07:43Z
    this.modalCtrl.dismiss(
      {
        scheduleDateTime: {
          datePicked: new Date(this.form.value['date-picked']).toUTCString(),
          timePicked: new Date(this.form.value['time-picked']).toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit'
        })
        }
      },
      'confirm'
    );
  }

}
