import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take, map, switchMap } from 'rxjs/operators';

import { AngularFirestoreCollection, AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { AuthService } from './../auth/auth.service';
import { Users } from './users';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private users: Observable<Users[]>;
  private usersCollection: AngularFirestoreCollection<Users>;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private afs: AngularFirestore
  ) {
    this.usersCollection = this.afs.collection<Users>('users');
    this.users = this.usersCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getUsers(searchKey: string): Observable<Users[]> {
    return this.users.pipe(
      map(users =>
        users.filter((user) => {
          return user.firstname.indexOf(searchKey) > -1;
        })
      )
    );
  }

  getUsersByRole(role: string) {
    return this.users.pipe(
      map(users =>
        users.filter((user) => {
          return user.role.indexOf(role) > -1;
        })
      )
    );
  }

  getUser(userId: string): Observable<Users> {
    return this.usersCollection.doc<Users>(userId).valueChanges().pipe(
      take(1),
      map(user => {
        user.id = userId;
        return user;
      })
    );
  }

  setLocation(selectedLocation: any, userId: string): Promise<void> {
    return this.usersCollection.doc(userId).set({
      location: selectedLocation
    }, { merge: true });
  }

  setNotification(selectedNotification: any, userId: string): Promise<void> {
    return this.usersCollection.doc(userId).set({
      notification: selectedNotification
    }, { merge: true });
  }

  setClassification(selectedClassification: string, userId: string) {
    return this.usersCollection.doc(userId).set({
      classification: selectedClassification
    }, { merge: true });
  }

  setVisibility(selectedVisibility: string, userId: string) {
    return this.usersCollection.doc(userId).set({
      visibility: selectedVisibility
    }, { merge: true });
  }

  setExpirience(selectedExperience: string, userId: string) {
    return this.usersCollection.doc(userId).set({
      experience: selectedExperience
    }, { merge: true });
  }

  updateUser(user: any): Promise<void> {
    return this.usersCollection.doc(user.id).update({
      firstname: user.firstname,
      lastname: user.lastname
    });
  }

  updateAvatar(image: string, userId: string) {
    return this.usersCollection.doc(userId).update({
      avatarUrl: image
    });
  }
}
