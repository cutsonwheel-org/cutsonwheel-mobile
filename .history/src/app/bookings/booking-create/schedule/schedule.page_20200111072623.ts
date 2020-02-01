import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
    this.assistant = this.getAssistant();
    console.log(this.assistant);
  }

  private getAssistant() {
    return JSON.parse(localStorage.getItem('assistant'));
  }
}
