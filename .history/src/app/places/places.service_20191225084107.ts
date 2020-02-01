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
  private offers: Observable<Places[]>;
  private offersCollection: AngularFirestoreCollection<Places>;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private afs: AngularFirestore
  ) {
    this.offersCollection = this.afs.collection<Places>('offered-places');
    this.offers = this.offersCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getOffers(searchKey: string): Observable<Places[]> {
    return this.offers.pipe(
      map(offers =>
        offers.filter((offer) => {
          return offer.title.indexOf(searchKey) > -1;
        })
      )
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
