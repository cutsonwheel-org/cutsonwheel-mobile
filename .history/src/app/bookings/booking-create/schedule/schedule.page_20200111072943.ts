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

  constructor(
    private bookingsService: BookingsService
  ) { }

  ngOnInit() {
    this.assistant = this.getAssistant();
    this.booking$ = this.bookingsService.getByAssistantId(this.assistant.assisstantId, 'pending');
  }

  private getAssistant() {
    return JSON.parse(localStorage.getItem('assistant'));
  }
}
