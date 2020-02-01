import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Offers } from 'src/app/services/offers/offers';

const currenctTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

@Component({
  selector: 'app-datetime-picker',
  templateUrl: './datetime-picker.component.html',
  styleUrls: ['./datetime-picker.component.scss'],
})
export class DatetimePickerComponent implements OnInit {
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
    this.modalCtrl.dismiss(
      {
        scheduleDateTime: {
          datePicked: new Date(this.form.value['date-picked']).toLocaleDateString(undefined, {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
          }),
          timePicked: new Date(this.form.value['time-picked']).toLocaleTimeString(undefined, {
            timeZone: currenctTimeZone,
            hour12 : false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
        }
      },
      'confirm'
    );
  }
}
