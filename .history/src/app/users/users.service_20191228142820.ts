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
  // setUserLocation(user: any): Promise<void> {
  //   return this.usersCollection.doc(user.id).set({
  //     address: user.address,
  //     latitude: user.latitude,
  //     longitude: user.longitude
  //   }, { merge: true });
  // }

  updateUser(user: any): Promise<void> {
    return this.usersCollection.doc(user.id).update({
      firstname: user.firstname,
      lastname: user.lastname
    });
  }

  uploadImage(image: File) {
    const uploadData = new FormData();
    uploadData.append('image', image);
    return this.authService.getIdToken().pipe(
      switchMap(token => {
        return this.http.post<{imageUrl: string, imagePath: string}>(
          'https://us-central1-cutsonwheel-233209.cloudfunctions.net/storeImage',
          uploadData,
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        );
      })
    );
  }
}
