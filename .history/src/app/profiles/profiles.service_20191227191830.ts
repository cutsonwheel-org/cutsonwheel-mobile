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

  constructor() { }



}
