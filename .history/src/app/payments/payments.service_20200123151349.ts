import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take, map, flatMap, mergeMap } from 'rxjs/operators';

import {
  AngularFirestoreCollection,
  AngularFirestore,
  DocumentReference
} from '@angular/fire/firestore';

import { Payments as useClass } from './payments';
import { Misc } from '../shared/class/misc';

const collection = 'payments';
const indexKey = 'paymentTo';
const orderField = 'paymentCreated';
const orderBy = 'desc';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  lastInResponse: any = [];

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
      .where('paymentCreated', '>', start)
      .where('paymentCreated', '<', end)
    );
  }

  private filterByAssistant(userId: string, start: Date, end: Date) {
    return this.afs.collection<useClass>(
      collection,
      ref => ref
      .where('paymentTo', '==', userId)
      .where('paymentCreated', '>', start)
      .where('paymentCreated', '<', end)
    );
  }

  private filterByUserIdWallet(userId: string) {
    return this.afs.collection<useClass>(
      collection,
      ref => ref
      .where(indexKey, '==', userId)
    );
  }

  private filterByUserId(userId: string) {
    return this.afs.collection<useClass>(
      collection,
      ref => ref
      .where(indexKey, '==', userId)
      .orderBy(orderField, orderBy)
      // .limit(5)
    );
  }

  private getLastDoc(userId: string) {
    let last;
    this.filterByUserId(userId).get().subscribe((documentSnapshots) => {
      last = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    });
    return last;
  }

  private filterByPaginate(userId: string) {
    return this.afs.collection<useClass>(collection, ref => ref
      .where(indexKey, '==', userId)
      .orderBy(orderField, orderBy)
      .startAfter(this.getLastDoc(userId))
      .limit(5)
    );
  }

  private fetchData(col: AngularFirestoreCollection): Observable<any> {
    return col.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            const datePaid = new Date(a.payload.doc.get('paymentCreated').seconds * 1000);
            const y = datePaid.getFullYear();
            const m = new Misc().pad(datePaid.getMonth() + 1);
            const d = new Misc().pad(datePaid.getDate());
            data.paymentCreatedTransformed = y + '-' + m + '-' + d;
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

  getByAssistant(userId: string, start: Date, end: Date): Observable<useClass[]> {
    return this.fetchData(this.filterByAssistant(userId, start, end));
  }

  getByUserId(userId: string): Observable<useClass[]> {
    return this.fetchData(this.filterByUserId(userId));
  }

  getByUserIdByLastVisible(userId: string): Observable<useClass[]> {
    return this.fetchData(this.filterByPaginate(userId));
  }

  getUserWallet(userId: string) {
    return this.fetchData(this.filterByUserIdWallet(userId));
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
