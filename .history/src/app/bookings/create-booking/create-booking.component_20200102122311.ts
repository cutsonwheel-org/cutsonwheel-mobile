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
  startDate: string;
  endDate: string;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    // const availableTo = new Date(this.selectedOffer.availableTo);
    // if (this.selectedMode === 'random') {
    //   this.startDate = new Date(
    //     availableFrom.getTime() +
    //       Math.random() *
    //         (availableTo.getTime() -
    //           7 * 24 * 60 * 60 * 1000 -
    //           availableFrom.getTime())
    //   ).toISOString();

    //   this.endDate = new Date(
    //     new Date(this.startDate).getTime() +
    //       Math.random() *
    //         (new Date(this.startDate).getTime() +
    //           6 * 24 * 60 * 60 * 1000 -
    //           new Date(this.startDate).getTime())
    //   ).toISOString();
    // }
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onBookOffer() {
    if (!this.form.valid) {
      return;
    }

    this.modalCtrl.dismiss(
      {
        bookingData: {
          firstName: this.form.value['first-name'],
          lastName: this.form.value['last-name'],
          guestNumber: +this.form.value['guest-number'],
          startDate: new Date(this.form.value['date-from']),
          endDate: new Date(this.form.value['date-to'])
        }
      },
      'confirm'
    );
  }

  datesValid() {
    const startDate = new Date(this.form.value['date-from']);
    const endDate = new Date(this.form.value['date-to']);
    return endDate > startDate;
  }
}
