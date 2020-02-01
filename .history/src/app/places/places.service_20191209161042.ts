import { Injectable } from '@angular/core';
import { Places } from './places';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private places$: Places[] = [
    new Places(
      'p1',
      'Manhattan Mansion',
      'In the heart of new york city.',
      'https://i.pinimg.com/originals/ca/3e/42/ca3e4211981957caa00a18a581ee17df.jpg',
      149.00
    )
  ];

  get places() {
    return [...this.places$];
  }

  constructor() { }

}
