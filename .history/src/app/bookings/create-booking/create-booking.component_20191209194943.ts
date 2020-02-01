import { Component, OnInit, Input } from '@angular/core';
import { Places } from 'src/app/places/places';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Places;

  constructor() { }

  ngOnInit() {}

}
