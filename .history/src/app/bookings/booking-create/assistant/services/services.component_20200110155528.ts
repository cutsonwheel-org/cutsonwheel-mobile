import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Users } from 'src/app/users/users';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit {
  @Input() selectedAssistant: Users;
  @ViewChild('f', { static: false }) form: NgForm;
  date: string = new Date().toISOString();
  offerId: string;
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
        offerId: this.selectedAssistant.id
      },
      'confirm'
    );
  }
}
