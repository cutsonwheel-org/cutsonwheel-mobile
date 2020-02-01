import { Component, OnInit, Input } from '@angular/core';
import { UsersService } from 'src/app/users/users.service';

@Component({
  selector: 'app-booking-item-avatar',
  templateUrl: './booking-item-avatar.component.html',
  styleUrls: ['./booking-item-avatar.component.scss'],
})
export class BookingItemAvatarComponent implements OnInit {
  @Input() userId: string;

  profile: any;

  constructor(
    private usersService: UsersService
  ) { }

  ngOnInit() {
    this.profile = this.usersService.getUser(this.userId);
  }

}
