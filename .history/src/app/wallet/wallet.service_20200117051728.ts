import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

import {
  AngularFirestoreCollection,
  AngularFirestore,
  DocumentReference
} from '@angular/fire/firestore';

import { Wallet as useClass } from './wallet';
import { Misc } from '../shared/class/misc';

const collection = 'wallet';
const orderField = 'paymentDate';
const orderBy = 'asc';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor(
    private afs: AngularFirestore
  ) { }

  private defaultCollection(): AngularFirestoreCollection<useClass> {
    return this.afs.collection<useClass>(collection, ref => ref.orderBy(orderField, orderBy));
  }

  private filterByUserId(userId: string) {
    return this.afs.collection<useClass>(
      collection,
      ref => ref
      .where('paymentTo', '==', userId)
    );
  }

  private fetchData(col: AngularFirestoreCollection): Observable<any> {
    return col.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;

            const datePaid = new Date(a.payload.doc.get('paymentDate').seconds * 1000);
            const y = datePaid.getFullYear();
            const m = new Misc().pad(datePaid.getMonth() + 1);
            const d = new Misc().pad(datePaid.getDate());
            data.formattedDate = y + '-' + m + '-' + d;
            return { id, ...data };
          });
        })
      );
  }

  getAll(): Observable<useClass[]> {
    return this.fetchData(this.defaultCollection());
  }

  getOne(id: string): Observable<useClass> {
    return this.defaultCollection().doc<useClass>(id).valueChanges().pipe(
      take(1),
      map(data => {
        return data;
      })
    );
  }

  getTotalWallet(userId: string) {
    // const collection = this.firestore.collection('users');
    // return  collection.valueChanges.pipe(
    //   mergeMap( (users: User[]) =>
    //              this.firestore.doc(`stories/${users[0].uid}`).
    //                       valueChanges().pipe(map(
    //                         (storie) => Object.assign({}, {users[0].uid, ...users[0], ...stories}
    //                     ))
    //          ))
    //  );

    const col = this.afs.collection<useClass>(collection,
      ref => ref
      .where('paymentTo', '==', userId)
      .orderBy('paymentDate', 'asc')
    );
    return col.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          console.log(data);
          return { id, ...data };
        });
      })
    );
  }

  getByUserId(userId: string): Observable<useClass[]> {
    return this.fetchData(this.filterByUserId(userId));
  }

  create(data: any): Promise<DocumentReference> {
    return this.defaultCollection().add(data);
  }

  update(data: any): Promise<void> {
    return this.defaultCollection().doc(data.id).update({
      title: data.title,
      description: data.description
    });
  }

  delete(id: string): Promise<void> {
    return this.defaultCollection().doc(id).delete();
  }
}
