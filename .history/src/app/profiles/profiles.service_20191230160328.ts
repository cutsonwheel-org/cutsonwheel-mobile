import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersService } from '../users/users.service';

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {

  constructor(
    private userService: UsersService
  ) { }

  public getLocations(userId: string): any {
    const locationObservable = new Observable(observer => {
      this.userService.getUser(userId).subscribe((detail) => {
        observer.next(detail.location);
      });
    });

    return locationObservable;
  }

}
