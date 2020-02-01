import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { AngularFirestoreCollection, AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { AuthService } from './../auth/auth.service';
import { Users as useClass } from './users';

const collection = 'users';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private afs: AngularFirestore
  ) {}

  private defaultCollection(): AngularFirestoreCollection<useClass> {
    return this.afs.collection<useClass>(collection);
  }

  private filterByAssistant() {
    return this.afs.collection<useClass>(
      collection,
      ref => ref.where('roles.assistant', '==', true)
    );
  }

  private filterByClient() {
    return this.afs.collection<useClass>(
      collection,
      ref => ref.where('roles.client', '==', true)
    );
  }

  private filterByAdmin() {
    return this.afs.collection<useClass>(
      collection,
      ref => ref.where('roles.admin', '==', true)
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

  getUsers(searchKey: string): Observable<useClass[]> {
    const user$ = this.fetchData(this.defaultCollection());
    return user$.pipe(
      map(users =>
        users.filter((user: useClass) => {
          return user.firstname.toLowerCase().includes(searchKey.toLowerCase());
        })
      )
    );
  }

  getByAssistant(searchKey: string): Observable<useClass[]> {
    const user$ = this.fetchData(this.filterByAssistant());
    return user$.pipe(
      map(users =>
        users.filter((user: useClass) => {
          return user.displayName.toLowerCase().includes(searchKey.toLowerCase());
        })
      )
    );
  }

  getByClient(searchKey: string) {
    const user$ = this.fetchData(this.filterByAssistant());
    return user$.pipe(
      map(users =>
        users.filter((user: useClass) => {
          return user.displayName.toLowerCase().includes(searchKey.toLowerCase());
        })
      )
    );
  }

  getByAdmin() {
    return this.fetchData(this.filterByAdmin());
  }

  getUser(userId: string): Observable<useClass> {
    return this.defaultCollection().doc<useClass>(userId).valueChanges().pipe(
      take(1),
      map(user => {
        return user;
      })
    );
  }

  update(user: any): Promise<void> {
    return this.defaultCollection().doc(user.id).set(user, { merge: true });
  }

  insert(user: firebase.User) {
    return this.defaultCollection().doc(user.uid).set({
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      phoneNumber: user.phoneNumber,
      isAnonymous: user.isAnonymous,
      tenantId: user.tenantId,
      metadata: {
        lastSignInTime: user.metadata.lastSignInTime,
        creationTime: user.metadata.creationTime
      },
      isSetupCompleted: false,
      isValidated: false
    });
  }

}
