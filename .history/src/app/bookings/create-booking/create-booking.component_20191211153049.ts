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
  startDate: string;
  endDate: string;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    const availableFrom = new Date(this.selectedPlace.availableFrom);
    const availableTo = new Date(this.selectedPlace.availableTo);

    if (this.selectedMode === 'random') {
      this.startDate = new Date(
        availableFrom.getTime() +
        Math.random() *
        (availableTo.getTime() -
        7 * 24 * 60 * 60 * 1000 -
        availableFrom.getTime())
      ).toDateString();

      this.endDate = new Date(
        new Date(this.startDate).getTime() + Math.random() * (
          new Date(this.startDate).getTime() + 6 * 24 * 60 * 60 * 1000 - new Date(this.startDate).getTime())
        ).toISOString();
    }
  }

  onBookPlace() {
    this.modalController.dismiss({
      message: 'this is a dummy message!'
    }, 'confirm');
  }

  onCancel() {
    this.modalController.dismiss(null, 'cancel');
  }
}
