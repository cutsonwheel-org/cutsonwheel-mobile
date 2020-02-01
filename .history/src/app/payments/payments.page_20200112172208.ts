import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { map, switchMap } from 'rxjs/operators';
import { PaymentsService } from './payments.service';
import { Payments } from './payments';
import { Observable, Subscription, of } from 'rxjs';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})
export class PaymentsPage implements OnInit, OnDestroy {

  public payments$: Observable<Payments[]>;
  public isLoading: boolean;
  public selectedSegment: string;
  private authSub: Subscription;

  constructor(
    private authsService: AuthService,
    private paymentsService: PaymentsService
  ) {
    this.isLoading = true;
    this.selectedSegment = 'today';
  }

  ngOnInit() {
    this.authSub = this.authsService.getUserState().subscribe((user) => {
      if (user) {
        this.isLoading = false;
        const start = new Date();
        console.log(start.toUTCString());
        const end = new Date();

        this.payments$ = this.paymentsService.getByAssistant(user.uid, start, end);
      }
    });
  }

  segmentChanged(ev: any) {
    this.selectedSegment = ev.detail.value;
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
}
