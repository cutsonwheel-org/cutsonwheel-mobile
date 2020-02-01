import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ImagePicker } from 'src/app/shared/components/image-picker/image-picker';
import { Subscription, of } from 'rxjs';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { ImagePickerService } from 'src/app/shared/components/image-picker/image-picker.service';
import { switchMap } from 'rxjs/operators';
import { WalletService } from '../wallet.service';
import { Users } from 'src/app/users/users';
import { UsersService } from 'src/app/users/users.service';
import { PaymentsService } from 'src/app/payments/payments.service';

@Component({
  selector: 'app-wallet-create',
  templateUrl: './wallet-create.page.html',
  styleUrls: ['./wallet-create.page.scss'],
})
export class WalletCreatePage implements OnInit {
  form: FormGroup;
  user: firebase.User;
  users: Users;
  imagePicker: ImagePicker;

  currency: string;
  qty: number;
  paymentMethod: string;

  private userAuth: Subscription;

  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private userService: UsersService,
    private walletService: WalletService,
    private paymentsService: PaymentsService,
    private imagePickerService: ImagePickerService,
  ) {
    this.qty = 1;
    this.currency = 'PHP';
    this.paymentMethod = 'cash';
  }

  ngOnInit() {
    this.userAuth = this.authService.getUserState().pipe(
      switchMap(user => {
        if (user) {
          this.user = user;
          return this.userService.getUser(user.uid);
        } else {
          return of(null);
        }
      })
    ).subscribe((users) => {
        this.users = users;
    });

    this.form = new FormGroup({
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(1000)]
      }),
      amount: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(2), Validators.maxLength(6)]
      })
    });
  }

  onCreatePayment() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Creating offer...'
      })
      .then(loadingEl => {
        loadingEl.present();
        const payment = {
          intent: 'authorize',
          payer: {
            paymentMethod: this.paymentMethod
          },
          transactions: {
            amount: {
              total: this.form.value.amount,
              currency: this.currency
            },
            description: this.form.value.description,
            invoiceNumber: Math.floor(Math.random() * 999999999), // autogenerate
            itemList: {
              items: [
                {
                  name: 'Deposit',
                  description: this.form.value.description,
                  quantity: 1,
                  price: this.form.value.amount,
                  currency: this.currency
                }
              ],
              shippingAddress: {
                recipientName: this.user.displayName,
                address: this.users.location.address
              }
            }
          },
          isValidated: false,
          paymentCreated: new Date(),
          paymentTo: this.user.uid
        };
        // insert payments
        this.paymentsService.insert(payment).then((ref) => {
          loadingEl.dismiss();
          this.router.navigateByUrl('/t/wallet');
        });
        // this.imagePickerService
        //   .uploadImage(this.form.get('image').value)
        //   .pipe(
        //     switchMap(uploadRes => {
        //       const offer  = {
        //         title: this.form.value.title,
        //         description: this.form.value.description,
        //         imageUrl: uploadRes.imageUrl,
        //         availability: this.form.value.availability,
        //         category: this.form.value.category,
        //         duration: this.form.value.duration,
        //         charges: +this.form.value.charges,
        //         userId: this.user.uid
        //       };
        //       return this.walletService.insert(offer);
        //     })
        //   )
        //   .subscribe(() => {
        //     loadingEl.dismiss();
        //     this.form.reset();
        //     this.router.navigate(['/t/services/offers']);
        //   });
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
