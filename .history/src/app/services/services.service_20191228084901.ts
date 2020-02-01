import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Services } from './services';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private services: Observable<Services[]>;
  private servicesCollection: AngularFirestoreCollection<Services>;

  constructor(
    private afs: AngularFirestore
  ) {
    this.servicesCollection = this.afs.collection<Services>('categories');
    this.services = this.servicesCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getServices(): Observable<Services[]> {
    return this.services;
  }
}
