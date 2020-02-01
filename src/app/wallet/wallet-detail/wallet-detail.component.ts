import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { PaymentsService } from 'src/app/payments/payments.service';
import { Payments } from 'src/app/payments/payments';

@Component({
  selector: 'app-wallet-detail',
  templateUrl: './wallet-detail.component.html',
  styleUrls: ['./wallet-detail.component.scss'],
})
export class WalletDetailComponent implements OnInit {
  @Input() paymentId: string;

  payment: Payments;
  constructor(
    private modalCtrl: ModalController,
    private paymentsService: PaymentsService,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    this.paymentsService.getOne(this.navParams.get('paymentId')).subscribe((payment) => {
      this.payment = payment;
      console.log(this.payment);
    });
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

}
