import { Injectable } from '@angular/core';
import { Observable, of, observable, forkJoin } from 'rxjs';
import { take, map, mergeMap, flatMap } from 'rxjs/operators';

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

  getTotalWallet(userId: string): Observable<any> {

    // return this.afs.collection<any>(collection,
    //   ref => ref
    //   .where('paymentTo', '==', userId)
    //   .orderBy('paymentDate', 'asc')
    // ).snapshotChanges().pipe(
    //   mergeMap( wallet => {
    //     return wallet.map(a => {
    //       const walletData = a.payload.doc.data();
    //       const walletId = a.payload.doc.id;
    //       // return this.afs.doc('payments/' + a.payload.doc.get('paymentId')).valueChanges().pipe(
    //       //   map(data2 => Object.assign({}, {id, ...data, ...data2}));
    //       // )

          // return this.afs.doc(`payments/${a.payload.doc.get('paymentId')}`)
          //   .valueChanges().pipe(
          //     flatMap(payment => {
          //         return ({walletId, ...walletData, payment}) as Observable<any>;
          //       }
          //     )
          //   );
          // });
    //   })
      let o;
      return this.afs.collection<any>(collection,
        ref => ref
        .where('paymentTo', '==', userId)
        .orderBy('paymentDate', 'asc')
      ).snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            o =  a.payload.doc.data();
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;

            const datePaid = new Date(a.payload.doc.get('paymentDate').seconds * 1000);
            const y = datePaid.getFullYear();
            const m = new Misc().pad(datePaid.getMonth() + 1);
            const d = new Misc().pad(datePaid.getDate());
            data.formattedDate = y + '-' + m + '-' + d;

            // const payment = this.afs.doc(`payments/${a.payload.doc.get('paymentId')}`)
            // .valueChanges();

            const payment = this.getSingleData(a.payload.doc.get('paymentId'));
            console.log(payment);
            return forkJoin([id, ...data, payment]);
            // return { id, ...data };
          })
          // mergeMap( wallet => {
          //   const payment = this.getSingleData(wallet);
          //   return forkJoin([payment]);
          // });
        })
      );
  }
  // mergeMap(fullResults => {
  //   console.log(fullResults);
  //   // tslint:disable-next-line: deprecation
  //   return this.afs.collection<any>('payments').doc<any>(fullResults.paymentId).valueChanges().pipe(
  //     take(1),
  //     map(p => {
  //       return p;
  //     })
  //   );
  // })
  public getSingleData(paymentId: string): Observable<any> {
    return this.afs.collection<any>('payments').doc<any>(paymentId).valueChanges().pipe(
      take(1),
      map(payment => {
        return payment;
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
