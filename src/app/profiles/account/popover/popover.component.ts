import { Component, OnInit, OnDestroy } from '@angular/core';
import { PopoverController, ToastController } from '@ionic/angular';
import { Subscription, of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { UsersService } from 'src/app/users/users.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit, OnDestroy {
  user: firebase.User;
  pushNotification: boolean;
  emailInvitations: boolean;
  emailUpdates: boolean;
  emailEvents: boolean;
  private authSub: Subscription;
  private userSub: Subscription;

  constructor(
    private popper: PopoverController,
    private authService: AuthService,
    private usersService: UsersService,
    private toastCtrl: ToastController
  ) {}

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
    ).subscribe((users) => {
      this.getUser(users.id);
    });
  }

  getUser(userId: string) {
    this.userSub = this.usersService.getUser(userId)
      .subscribe((detail) => {
        this.pushNotification = (detail.notifications) ? detail.notifications.pushNotification : true;
        this.emailInvitations = (detail.notifications) ? detail.notifications.emailInvitations : true;
        this.emailUpdates = (detail.notifications) ? detail.notifications.emailUpdates : true;
        this.emailEvents = (detail.notifications) ? detail.notifications.emailEvents : true;
      }
    );
  }

  onDismiss() {
    this.popper.dismiss(null, 'dismiss');
  }

  onNotificationSelect(event: CustomEvent) {
    if (event.detail.value === 'pushNotification') {
      this.pushNotification = event.detail.checked;
    }
    if (event.detail.value === 'emailInvitations') {
      this.emailInvitations = event.detail.checked;
    }
    if (event.detail.value === 'emailUpdates') {
      this.emailUpdates = event.detail.checked;
    }
    if (event.detail.value === 'emailEvents') {
      this.emailEvents = event.detail.checked;
    }
    const data = {
      id: this.user.uid,
      notifications: {
        pushNotification: this.pushNotification,
        emailInvitations: this.emailInvitations,
        emailUpdates: this.emailUpdates,
        emailEvents: this.emailEvents
      }
    };

    this.usersService.update(data).then(() => {
      this.toastCtrl.create({
        message: event.detail.value + ' updated',
        duration: 2000
      }).then(toast => toast.present());
    });
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
    this.userSub.unsubscribe();
  }
}
