import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

import {
  AngularFirestoreCollection,
  AngularFirestore,
  DocumentReference
} from '@angular/fire/firestore';

import { Offers as useClass } from './offers';

const collection = 'offers';
const indexKey = 'userId';
const orderField = 'title';
const orderBy = 'asc';

@Injectable({
  providedIn: 'root'
})
export class OffersService {

  constructor(
    private afs: AngularFirestore
  ) {}

  private defaultCollection(): AngularFirestoreCollection<useClass> {
    return this.afs.collection<useClass>(collection, ref => ref.orderBy(orderField, orderBy));
  }

  private filterByUserId(userId: string) {
    return this.afs.collection<useClass>(
      collection,
      ref => ref
      .where(indexKey, '==', userId)
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

  getSize() {
    return this.afs.collection<useClass>(collection).get();
  }

  getSizeById(userId: string) {
    return this.afs.collection<useClass>(collection,
      ref => ref
      .where('userId', '==', userId)).get();
  }

  getAll(searchKey: string): Observable<useClass[]> {
    const datas = this.fetchData(this.defaultCollection());
    return datas.pipe(
      map(dataList =>
        dataList.filter((data: useClass) => {
          return data.title.toLowerCase().includes(searchKey.toLowerCase());
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

  getByUserId(userId: string): Observable<useClass[]> {
    return this.fetchData(this.filterByUserId(userId));
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
