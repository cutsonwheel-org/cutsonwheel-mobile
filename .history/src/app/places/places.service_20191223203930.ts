import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { Places } from './places';
import { PlaceLocation } from './location';
import { AngularFirestoreCollection, AngularFirestore, DocumentReference } from '@angular/fire/firestore';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
  location: PlaceLocation;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private placeSub = new BehaviorSubject<Places[]>([]);
  private offers: Observable<Places[]>;
  private offersCollection: AngularFirestoreCollection<Places>;

  get places() {
    return this.placeSub.asObservable();
  }

  public items: any = [];

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private afs: AngularFirestore
  ) {}

  // =======================
  getOffers(searchTerm: string): Observable<Places[]> {
    this.offersCollection = this.afs.collection<Places>('offered-places');
    return this.offersCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          this.items = { id, ...data };
          console.log(this.items);
          // return { id, ...data };
          return this.items.filter(item => {
            return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
          });
        });
      })
    );
  }

  getMyOffers(): Observable<Places[]> {
    this.offersCollection = this.afs.collection<Places>(
      'offered-places',
      ref => ref
      .where('userId', '==', '6nq6YYxHQ5YpQdpoxypxNZIRPjS2')
    );
    return this.offersCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getOffer(id: string): Observable<Places> {
    return this.offersCollection.doc<Places>(id).valueChanges().pipe(
      take(1),
      map(place => {
        place.id = id;
        return place;
      })
    );
  }

  insertPlace(place: any): Promise<DocumentReference> {
    return this.offersCollection.add(place);
  }

  updateBooking(place: any): Promise<void> {
    return this.offersCollection.doc(place.id).update({
      title: place.title,
      description: place.description
    });
  }

  deletePlace(id: string): Promise<void> {
    return this.offersCollection.doc(id).delete();
  }
  // =======================

  fetchPlaces() {
    let fetchUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
      if (!userId) {
        throw new Error('User not found');
      }
      fetchUserId = userId;
      return this.authService.token;
    }),
    take(1),
    switchMap(token => {
      return this.http
        .get<{ [key: string]: PlaceData }>(
          `https://cutsonwheel-233209.firebaseio.com/offered-places.json?orderBy="userId"&equalTo="${fetchUserId}"&auth=${token}`
        );
      }),
      map(resData => {
        const places = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            places.push(
              new Places(
                key,
                resData[key].title,
                resData[key].description,
                resData[key].imageUrl,
                resData[key].price,
                new Date(resData[key].availableFrom),
                new Date(resData[key].availableTo),
                resData[key].userId,
                resData[key].location
              )
            );
          }
        }
        return places;
      }),
      tap(places => {
        this.placeSub.next(places);
      })
    );
  }

  fetchAllPlaces() {
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
      return this.http
        .get<{ [key: string]: PlaceData }>(
          `https://cutsonwheel-233209.firebaseio.com/offered-places.json?auth=${token}`
        );
      }),
      map(resData => {
        const places = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            places.push(
              new Places(
                key,
                resData[key].title,
                resData[key].description,
                resData[key].imageUrl,
                resData[key].price,
                new Date(resData[key].availableFrom),
                new Date(resData[key].availableTo),
                resData[key].userId,
                resData[key].location
              )
            );
          }
        }
        return places;
      }),
      tap(places => {
        this.placeSub.next(places);
      })
    );
  }

  getPlace(id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.get<PlaceData>(
          `https://cutsonwheel-233209.firebaseio.com/offered-places/${id}.json?auth=${token}`
        );
      }),
      map(placeData => {
        return new Places(
          id,
          placeData.title,
          placeData.description,
          placeData.imageUrl,
          placeData.price,
          new Date(placeData.availableFrom),
          new Date(placeData.availableTo),
          placeData.userId,
          placeData.location
        );
      })
    );
  }

  uploadImage(image: File) {
    const uploadData = new FormData();
    uploadData.append('image', image);

    return this.authService.token.pipe(
      switchMap(token => {
        return this.http.post<{imageUrl: string, imagePath: string}>(
          'https://us-central1-cutsonwheel-233209.cloudfunctions.net/storeImage',
          uploadData,
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        );
      })
    );
  }

  createPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date,
    location: PlaceLocation,
    imageUrl: string
  ) {
    let generatedId: string;
    let fetchUserId: string;
    let newPlace: Places;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        fetchUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap(token => {
      if (!fetchUserId) {
        throw new Error('No user found!');
      }
      newPlace = new Places(
        Math.random().toString(),
        title,
        description,
        imageUrl,
        price,
        dateFrom,
        dateTo,
        fetchUserId,
        location
      );
      return this.http
        .post<{ name: string }>(
          `https://cutsonwheel-233209.firebaseio.com/offered-places.json?auth=${token}`,
          {
            ...newPlace,
            id: null
          }
        );
    }),
      switchMap(resData => {
        generatedId = resData.name;
        return this.places;
      }),
      take(1),
      tap(places => {
        newPlace.id = generatedId;
        this.placeSub.next(places.concat(newPlace));
      })
    );
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Places[];
    let fetchedToken: string;

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        fetchedToken = token;
        return this.places;
      }),
      take(1),
      switchMap(places => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap(places => {
        const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Places(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId,
          oldPlace.location
        );
        return this.http.put(
          `https://cutsonwheel-233209.firebaseio.com/offered-places/${placeId}.json?auth=${fetchedToken}`,
          { ...updatedPlaces[updatedPlaceIndex], id: null }
        );
      }),
      tap(() => {
        this.placeSub.next(updatedPlaces);
      })
    );
  }
}
