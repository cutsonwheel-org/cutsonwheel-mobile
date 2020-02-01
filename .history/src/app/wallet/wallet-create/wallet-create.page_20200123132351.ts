import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ImagePicker } from 'src/app/shared/components/image-picker/image-picker';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { ImagePickerService } from 'src/app/shared/components/image-picker/image-picker.service';
import { PaymentsService } from 'src/app/payments/payments.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-wallet-create',
  templateUrl: './wallet-create.page.html',
  styleUrls: ['./wallet-create.page.scss'],
})
export class WalletCreatePage implements OnInit {
  form: FormGroup;
  user: firebase.User;
  imagePicker: ImagePicker;
  private userAuth: Subscription;

  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private paymentsService: PaymentsService,
    private imagePickerService: ImagePickerService,
  ) { }

  ngOnInit() {
    this.userAuth = this.authService.getUserState()
    .subscribe((user) => {
      this.user = user;
    });

    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(250)]
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(1000)]
      }),
      availability: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      category: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      duration: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      charges: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(2), Validators.maxLength(6)]
      }),
      image: new FormControl(null)
    });
  }

  onCreatePayment() {
    if (!this.form.valid || !this.form.get('image').value) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Creating offer...'
      })
      .then(loadingEl => {
        loadingEl.present();

        this.imagePickerService
          .uploadImage(this.form.get('image').value)
          .pipe(
            switchMap(uploadRes => {
              const offer  = {
                title: this.form.value.title,
                description: this.form.value.description,
                imageUrl: uploadRes.imageUrl,
                availability: this.form.value.availability,
                category: this.form.value.category,
                duration: this.form.value.duration,
                charges: +this.form.value.charges,
                userId: this.user.uid
              };
              return this.paymentsService.insert(offer);
            })
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/t/services/offers']);
          });
      });
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
        return;
      }
    } else {
      imageFile = imageData;
    }
    this.form.patchValue({ image: imageFile });
  }
}
