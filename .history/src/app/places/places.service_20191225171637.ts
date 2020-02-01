import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take, map, switchMap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { Places } from './places';
import { PlaceLocation } from './location';
import { AngularFirestoreCollection, AngularFirestore, DocumentReference } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private places: Observable<Places[]>;
  private placesCollection: AngularFirestoreCollection<Places>;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private afs: AngularFirestore
  ) {
    this.placesCollection = this.afs.collection<Places>('offered-places');
    this.places = this.placesCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getPlaces(searchKey: string): Observable<Places[]> {
    return this.places.pipe(
      map(places =>
        places.filter((place) => {
          return place.title.indexOf(searchKey) > -1;
        })
      )
    );
  }

  getMyPlaces(): Observable<Places[]> {
    this.placesCollection = this.afs.collection<Places>(
      'offered-places',
      ref => ref
      .where('userId', '==', '6nq6YYxHQ5YpQdpoxypxNZIRPjS2')
    );
    return this.placesCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getPlace(id: string): Observable<Places> {
    return this.placesCollection.doc<Places>(id).valueChanges().pipe(
      take(1),
      map(place => {
        place.id = id;
        return place;
      })
    );
  }

  insertPlace(place: any): Promise<DocumentReference> {
    return this.placesCollection.add(place);
  }

  updatePlace(place: any): Promise<void> {
    return this.placesCollection.doc(place.id).update({
      title: place.title,
      description: place.description
    });
  }

  deletePlace(id: string): Promise<void> {
    return this.placesCollection.doc(id).delete();
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
}
