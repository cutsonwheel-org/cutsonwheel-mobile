import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/users/users.service';
import { Observable } from 'rxjs';
import { Users } from 'src/app/users/users';

@Component({
  selector: 'app-assistant',
  templateUrl: './assistant.page.html',
  styleUrls: ['./assistant.page.scss'],
})
export class AssistantPage implements OnInit {
  public assistants$: Observable<Users[]>;

  constructor(
    private usersService: UsersService,
  ) { }

  ngOnInit() {
    this.assistants$ = this.usersService.getByAssistant();
  }

}
