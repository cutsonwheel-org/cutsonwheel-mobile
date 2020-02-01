import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { take, map } from 'rxjs/operators';

import {
  AngularFirestoreCollection,
  AngularFirestore,
  DocumentReference
} from '@angular/fire/firestore';

import { Categories as useClass } from './../class/categories';
import { AutoCompleteService } from 'ionic4-auto-complete';

const collection = 'categories';
const indexKey = 'slug';
const orderField = 'name';
const orderBy = 'asc';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService implements AutoCompleteService {
  labelAttribute = 'name';

  private categories: any[] = [];

  constructor(
    private afs: AngularFirestore
  ) { }

  getResults(keyword: string) {
    if (!keyword) { return false; }

    return this.fetchData(this.defaultCollection()).pipe(
      map((result: any[]) => {
          return result.filter(
             (item) => {
                return item.name.toLowerCase().startsWith(
                   keyword.toLowerCase()
                );
             }
          );
       }
    ));
 }

  private defaultCollection(): AngularFirestoreCollection<useClass> {
    return this.afs.collection<useClass>(collection, ref => ref.orderBy(orderField, orderBy));
  }

  private filterBySlug(slug: string) {
    return this.afs.collection<useClass>(
      collection,
      ref => ref
      .where(indexKey, '==', slug)
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

  getBySlug(slug: string): Observable<useClass[]> {
    return this.fetchData(this.filterBySlug(slug));
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
