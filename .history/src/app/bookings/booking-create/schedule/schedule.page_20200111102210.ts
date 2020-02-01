import { Component, OnInit } from '@angular/core';
import { BookingsService } from '../../bookings.service';
import { Observable } from 'rxjs';
import { Bookings } from '../../bookings';

interface Assistant {
  assisstantId: string;
  selectedServices: any[];
  subTotal: number;
}
@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {
  public assistant: Assistant;
  public booking$: Observable<Bookings[]>;
  public isLoading: boolean;

  constructor(
    private bookingsService: BookingsService
  ) {
    this.isLoading = true;
   }

  ngOnInit() {
    this.assistant = this.getAssistant();
    this.booking$ = this.bookingsService.getByAssistantId(this.assistant.assisstantId, 'pending');
    if (this.booking$) {
      this.isLoading = false;
    }
  }

  private getAssistant() {
    return JSON.parse(localStorage.getItem('assistant'));
  }
}
