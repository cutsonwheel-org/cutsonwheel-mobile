import { Component, OnInit, Input } from '@angular/core';
import { Places } from 'src/app/places/places';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Places;
  @Input() selectedMode: 'select' | 'random';

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  onBookPlace() {
    this.modalController.dismiss({
      message: 'this is a dummy message!'
    }, 'confirm');
  }

  onCancel() {
    this.modalController.dismiss(null, 'cancel');
  }
}
