import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../places.service';
import { Places } from '../places';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  locadedPlaces: Places[];

  constructor(private placesService: PlacesService) { }

  ngOnInit() {
    this.locadedPlaces = this.placesService.places;
  }

}
