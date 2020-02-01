import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Profiles } from './profiles';
import { take, switchMap, map, tap } from 'rxjs/operators';
import { PlaceLocation } from '../services/location';

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
