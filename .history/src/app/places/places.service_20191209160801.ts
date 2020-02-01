import { Injectable } from '@angular/core';
import { Places } from './places';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private $places: Places[] = [];

  get places() {
    return [...this.$places];
  }

  constructor() { }

}
