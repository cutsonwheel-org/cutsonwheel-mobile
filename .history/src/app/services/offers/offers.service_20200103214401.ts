import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take, map, switchMap } from 'rxjs/operators';

import { AngularFirestoreCollection, AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { AuthService } from './../../auth/auth.service';
import { Offers } from './offers';

@Injectable({
  providedIn: 'root'
})
export class OffersService {

  // private offers: Observable<Offers[]>;
  private offersCollection: AngularFirestoreCollection<Offers>;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private afs: AngularFirestore
  ) {}

  getOfferData(collection: AngularFirestoreCollection): Observable<any> {
    return collection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getOffers(searchKey: string): Observable<Offers[]> {
    const collection$ = this.afs.collection<Offers>('offers');
    const offer$ = this.getOfferData(collection$);
    return offer$.pipe(
      map(offers =>
        offers.filter((offer: Offers) => {
          return offer.title.toLowerCase().includes(searchKey.toLowerCase());
          // return offer.title.indexOf(searchKey) > -1;
        })
      )
    );
  }

  getMyOffers(userId: string): Observable<Offers[]> {
    const collection$ = this.afs.collection<Offers>(
      'offers',
      ref => ref
      .where('userId', '==', userId)
    );
    return this.getOfferData(collection$);
  }

  getOffer(id: string): Observable<Offers> {
    console.log(id);
    return this.offersCollection.doc<Offers>(id).valueChanges().pipe(
      take(1),
      map(offer => {
        offer.id = id;
        return offer;
      })
    );
  }

  insertOffer(offer: any): Promise<DocumentReference> {
    return this.offersCollection.add(offer);
  }

  updateOffer(offer: any): Promise<void> {
    return this.offersCollection.doc(offer.id).update({
      title: offer.title,
      description: offer.description
    });
  }

  deleteOffer(id: string): Promise<void> {
    return this.offersCollection.doc(id).delete();
  }

  // uploadImage(image: File) {
  //   const uploadData = new FormData();
  //   uploadData.append('image', image);
  //   return this.authService.getIdToken().pipe(
  //     switchMap(token => {
  //       return this.http.post<{imageUrl: string, imagePath: string}>(
  //         'https://us-central1-cutsonwheel-233209.cloudfunctions.net/storeImage',
  //         uploadData,
  //         {
  //           headers: { Authorization: 'Bearer ' + token }
  //         }
  //       );
  //     })
  //   );
  // }
}
