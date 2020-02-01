import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, DocumentReference } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Classifications } from './classifications';

@Injectable({
  providedIn: 'root'
})
export class ClassificationsService {

  private classifications: Observable<Classifications[]>;
  private classificationsCollection: AngularFirestoreCollection<Classifications>;

  constructor(
    private afs: AngularFirestore
  ) {
    this.classificationsCollection = this.afs.collection<Classifications>('classifications');
    this.classifications = this.classificationsCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getPayments(): Observable<Classifications[]> {
    return this.classifications;
  }

  getPaymentsDetail(id: string): Observable<Classifications> {
    return this.classificationsCollection.doc<Classifications>(id).valueChanges().pipe(
      take(1),
      map(classifications => {
        classifications.id = id;
        return classifications;
      })
    );
  }

  insertPayment(classification: any): Promise<DocumentReference> {
    return this.classificationsCollection.add(classification);
  }

  updatePayment(classification: any): Promise<void> {
    return this.classificationsCollection.doc(classification.id).update({
      name: classification.title,
      description: classification.description,
      image: classification.image,
      slug: classification.slug
    });
  }

  deletePayment(id: string): Promise<void> {
    return this.classificationsCollection.doc(id).delete();
  }
}
