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
      149.00,
      new Date('2019-01-01'),
      new Date('2019-12-22')
    ),
    new Places(
      'p2',
      'L\'Amour toujours',
      'Romantic place in paris.',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhCAqjUeSb4Mk8g-iXrfbtENiAT7SaHctJjDP7tG6CiMoD31an&s',
      129.00,
      new Date('2019-01-01'),
      new Date('2019-12-22')
    ),
    new Places(
      'p3',
      'Little China',
      'Ompin is the litle china town in manila',
      'https://i.ytimg.com/vi/oVxYzYuTTTw/hqdefault.jpg',
      100.00,
      new Date('2019-01-01'),
      new Date('2019-12-22')
    )
  ];

  get places() {
    return [...this.places$];
  }

  constructor() { }

  getPlace(placeId: string) {
    return {...this.places$.find(
      p => p.id === placeId
    )};
  }
}
