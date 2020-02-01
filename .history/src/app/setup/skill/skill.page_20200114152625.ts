import { Component, OnInit } from '@angular/core';

export interface Skill {
  name: string;
  level?: string;
}
@Component({
  selector: 'app-skill',
  templateUrl: './skill.page.html',
  styleUrls: ['./skill.page.scss'],
})
export class SkillPage implements OnInit {

  skills: Skill;

  constructor() { }

  ngOnInit() {
  }

  onNext() {
    // if (!this.firstname || !this.lastname || !this.address) {
    //   return;
    // }
    // const data = {
    //   id: this.user.uid,
    //   firstname: this.firstname,
    //   lastname: this.lastname,
    //   middlename: this.middlename,
    //   displayName: this.displayName,
    //   phoneNumber: this.phoneNumber.e164,
    //   location: {
    //     lat: this.lat,
    //     lng: this.lng,
    //     address: this.address,
    //     staticMapImageUrl: this.staticMapImageUrl
    //   },
    //   roles: {
    //     client: (this.role === 'client') ? true : false,
    //     assistant: (this.role === 'assistant') ? true : false
    //   }
    // };
    // this.usersService.update(data).then(() => {
    //   this.user.updateProfile({
    //     displayName: this.displayName
    //   }).then(() => {
    //     // skill select
    //     // experience
    //     // language

    //     this.router.navigateByUrl('setup/skill');
    //   });
    // });
  }

}
