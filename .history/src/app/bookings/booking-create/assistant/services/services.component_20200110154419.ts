import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Offers } from 'src/app/services/offers/offers';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit {
  @Input() selectedOffer: Offers;
  @ViewChild('f', { static: false }) form: NgForm;
  date: string = new Date().toISOString();
  datePicked: string;
  timePicked: string;

  constructor(private modalCtrl: ModalController) { }

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
        serviceSelected: {
          assisstantId: this.selectedOffer.userId,
          offerId: this.selectedOffer.id
        },
        scheduleDateTime: {
          datePicked: new Date(this.form.value['date-picked']).toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
          }),
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
