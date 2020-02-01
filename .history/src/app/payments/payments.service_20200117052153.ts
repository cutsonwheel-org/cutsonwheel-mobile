import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

import {
  AngularFirestoreCollection,
  AngularFirestore,
  DocumentReference
} from '@angular/fire/firestore';

import { Payments as useClass } from './payments';

const collection = 'payments';
const indexKey = 'userId';
const orderField = 'datePaid';
const orderBy = 'asc';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  constructor(
    private afs: AngularFirestore
  ) {}

  private defaultCollection(): AngularFirestoreCollection<useClass> {
    return this.afs.collection<useClass>(collection, ref => ref.orderBy(orderField, orderBy));
  }

  private filterByClient(userId: string, start: string, end: string) {
    return this.afs.collection<useClass>(
      collection,
      ref => ref
      .where('transactions.from', '==', userId)
      .where('datePaid', '>', start)
      .where('datePaid', '<', end)
    );
  }

  private filterByAssistant(userId: string, start: string, end: string) {
    return this.afs.collection<useClass>(
      collection,
      ref => ref
      .where('transactions.to', '==', userId)
      .where('datePaid', '>', start)
      .where('datePaid', '<', end)
    );
  }

  private filterByPaymentId(paymentId: string) {
    return this.afs.collection<useClass>(
      collection,
      ref => ref
      .where('id', '==', paymentId)
    );
  }

  private fetchData(col: AngularFirestoreCollection): Observable<any> {
    return col.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getAll(searchKey: string): Observable<useClass[]> {
    const datas = this.fetchData(this.defaultCollection());
    return datas.pipe(
      map(dataList =>
        dataList.filter((data: useClass) => {
          return data.transactions.description.toLowerCase().includes(searchKey.toLowerCase());
        })
      )
    );
  }

  getOne(id: string): Observable<useClass> {
    return this.defaultCollection().doc<useClass>(id).valueChanges().pipe(
      take(1),
      map(data => {
        data.id = id;
        return data;
      })
    );
  }

  getByClient(userId: string, start: string, end: string): Observable<useClass[]> {
    return this.fetchData(this.filterByClient(userId, start, end));
  }

  getByAssistant(userId: string, start: string, end: string): Observable<useClass[]> {
    return this.fetchData(this.filterByAssistant(userId, start, end));
  }

  insert(data: any): Promise<DocumentReference> {
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
