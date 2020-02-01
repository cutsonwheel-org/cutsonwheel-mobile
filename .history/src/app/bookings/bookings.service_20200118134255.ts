import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

import {
  AngularFirestoreCollection,
  AngularFirestore,
  DocumentReference
} from '@angular/fire/firestore';

import { Bookings as useClass } from './bookings';
import { Misc } from '../shared/class/misc';

const collection = 'bookings';

@Injectable({ providedIn: 'root' })
export class BookingsService {
  constructor(
    private afs: AngularFirestore
  ) {}

  private defaultCollection(): AngularFirestoreCollection<useClass> {
    return this.afs.collection<useClass>(collection);
  }

  private filterByClientId(userId: string, status: string) {
    return this.afs.collection<useClass>(
      collection,
      ref => ref
      .where('userId', '==', userId)
      .where('status', '==', status)
    );
  }

  private filterByAssistantId(userId: string, status: string) {
    return this.afs.collection<useClass>(
      collection,
      ref => ref
      .where('assistant.assistantId', '==', userId)
      .where('status', '==', status)
    );
  }

  private filterByAllAssistant(userId: string) {
    return this.afs.collection<useClass>(
      collection,
      ref => ref
      .where('assistant.assistantId', '==', userId)
    );
  }

  private filterByAllClient(userId: string) {
    return this.afs.collection<useClass>(
      collection,
      ref => ref
      .where('userId', '==', userId)
    );
  }

  private fetchData(col: AngularFirestoreCollection): Observable<any> {
    return col.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            console.log(data);
            const id = a.payload.doc.id;

            const timePicked = data.schedule.timePicked;
            const datePaid = new Date(data.schedule.datePicked);
            data.formattedDate = new Misc().mergeDateTime(datePaid, timePicked);
            return { id, ...data };
          });
        })
      );
  }

  getSize() {
    return this.afs.collection<useClass>(collection).get();
  }

  getSizeById(userId: string) {
    return this.afs.collection<useClass>(collection,
      ref => ref
      .where('userId', '==', userId)).get();
  }

  getByClientId(userId: string, status: string) {
    let query;
    if (status === 'history') {
      query = this.filterByAllClient(userId);
    } else {
      query = this.filterByClientId(userId, status);
    }
    return this.fetchData(query);
  }

  getByAssistantId(userId: string, status: string) {
    let query;
    if (status === 'history') {
      query = this.filterByAllAssistant(userId);
    } else {
      query = this.filterByAssistantId(userId, status);
    }
    return this.fetchData(query);
  }

  getAll(): Observable<useClass[]> {
    return this.fetchData(this.defaultCollection());
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

  insert(data: any): Promise<DocumentReference> {
    return this.defaultCollection().add(data);
  }

  update(data: any): Promise<void> {
    return this.defaultCollection().doc(data.id).update({
      status: data.status
    });
  }

  delete(id: string): Promise<void> {
    return this.defaultCollection().doc(id).delete();
  }


}
