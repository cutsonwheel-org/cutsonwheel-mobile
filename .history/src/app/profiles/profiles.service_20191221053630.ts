import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Profiles } from './profiles';
import { take, switchMap, map, tap } from 'rxjs/operators';
import { PlaceLocation } from '../places/location';

interface Profile {
  firstname: string;
  lastname: string;
  dateOfBirth: Date;
  avatarUrl: string;
  userId: string;
  location: PlaceLocation;
}

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {

  constructor(private authService: AuthService, private http: HttpClient) { }

  getProfile(userId: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.get<Profile>(
          `https://cutsonwheel-233209.firebaseio.com/profiles/${userId}.json?auth=${token}`
        );
      }),
      map(profileData => {
        console.log(profileData);
        return new Profiles(
          userId,
          profileData.firstname,
          profileData.lastname,
          profileData.dateOfBirth,
          profileData.avatarUrl,
          profileData.userId,
          profileData.location
        );
      })
    );
  }

  uploadImage(image: File) {
    const uploadData = new FormData();
    uploadData.append('image', image);

    return this.authService.token.pipe(
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

  addProfile(
    firstname: string,
    lastname: string,
    dateOfBirth: Date,
    avatarUrl: string,
    location: PlaceLocation,
  ) {
    let fetchUserId: string;
    let newProfile: Profiles;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        fetchUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap(token => {
      if (!fetchUserId) {
        throw new Error('No user found!');
      }
      newProfile = new Profiles(
        Math.random().toString(),
        firstname,
        lastname,
        dateOfBirth,
        avatarUrl,
        fetchUserId,
        location
      );
      return this.http
        .post<{ name: string }>(
          `https://cutsonwheel-233209.firebaseio.com/profiles.json?auth=${token}`,
          {
            ...newProfile,
            id: null
          }
        );
    }));
  }

  // updateProfile(
  //   userId: string,
  //   firstname: string,
  //   lastname: string
  // ) {
  //   let updatedPlaces: Profiles[];
  //   let fetchedToken: string;

  //   return this.authService.token.pipe(
  //     take(1),
  //     switchMap(token => {
  //       fetchedToken = token;
  //       return this.places;
  //     }),
  //     switchMap(places => {
  //       const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
  //       updatedPlaces = [...places];
  //       const oldPlace = updatedPlaces[updatedPlaceIndex];
  //       updatedPlaces[updatedPlaceIndex] = new Profiles(
  //         oldPlace.id,
  //         title,
  //         description,
  //         oldPlace.imageUrl,
  //         oldPlace.price,
  //         oldPlace.availableFrom,
  //         oldPlace.availableTo,
  //         oldPlace.userId,
  //         oldPlace.location
  //       );
  //       return this.http.put(
  //         `https://cutsonwheel-233209.firebaseio.com/offered-places/${placeId}.json?auth=${fetchedToken}`,
  //         { ...updatedPlaces[updatedPlaceIndex], id: null }
  //       );
  //     })
  //   );
  // }
}
