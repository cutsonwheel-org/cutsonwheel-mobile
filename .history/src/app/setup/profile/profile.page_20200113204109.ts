import { Component, OnInit } from '@angular/core';
import { Subscription, of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/users/users.service';
import { ImagePicker } from 'src/app/shared/pickers/image-picker/image-picker';
import { ImagePickerService } from 'src/app/shared/pickers/image-picker/image-picker.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  private authSub: Subscription;
  user: firebase.User;
  imagePicker: ImagePicker;

  firstname: string;
  lastname: string;
  displayName: string;
  isReadonly: boolean;
  photoURL: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private usersService: UsersService,
    private imagePickerService: ImagePickerService,
  ) {
    this.isReadonly = true;
   }

  ngOnInit() {
    this.authSub = this.authService.getUserState().pipe(
      switchMap(user => {
        if (user) {
          this.user = user;
          return this.usersService.getUser(user.uid);
        } else {
          return of(null);
        }
      })
    ).subscribe( profile => {
        if (this.user) {
          this.firstname = profile.firstname;
          this.lastname = profile.lastname;
          this.displayName = this.user.displayName;
          this.photoURL = this.user.photoURL;
        }
    });
  }

  onNext() {
    if (!this.firstname || !this.lastname ) {
      return;
    }

    this.imagePickerService
      .uploadImage(this.photoURL)
      .pipe(
        switchMap(uploadRes => {
          this.user.updateProfile({
            displayName: this.displayName,
            photoURL: uploadRes.imageUrl
          });

          const data = {
            id: this.user.uid,
            displayName: this.displayName,
            photoURL: uploadRes.imageUrl
          };
          return this.usersService.update(data);
        })
      )
      .subscribe(() => {
        console.log('next');
      });
  }

  onReplaceDisplayName(event: CustomEvent) {
    this.isReadonly = !this.isReadonly;
  }

  onImagePicked(imageData: string | File) {
    let imageFile;
    if (typeof imageData === 'string') {
      try {
        imageFile = this.imagePicker.base64toBlob(
          imageData.replace('data:image/jpeg;base64,', ''),
          'image/jpeg'
        );
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = imageData;
    }
    this.photoURL = imageFile;
  }
}
