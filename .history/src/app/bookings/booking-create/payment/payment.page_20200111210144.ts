import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/users/users.service';

interface Assistant {
  assisstantId: string;
  selectedServices: any[];
  subTotal: number;
}

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  assistant: Assistant;

  constructor() { }

  ngOnInit() {
    // get assistant
    this.assistant = this.getAssistant();
  }

  private getAssistant() {
    return JSON.parse(localStorage.getItem('assistant'));
  }
}
