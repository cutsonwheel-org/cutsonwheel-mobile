import { Component, OnInit } from '@angular/core';
import { Classifications } from 'src/app/classifications/classifications';
import { Observable } from 'rxjs';
import { ClassificationsService } from 'src/app/classifications/classifications.service';

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
  classifications: Observable<Classifications[]>;
  selectedClassification: string;

  constructor(
    private classificationsService: ClassificationsService,
  ) { }

  ngOnInit() {
    this.classifications = this.classificationsService.getClassifications();
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

  onPickedSkill(classification: string) {
    this.selectedClassification = classification;
    // this.modalCtrl.create({
    //     component: ServicesComponent,
    //     componentProps: {
    //       assistantId: userId
    //     }
    //   }).then(modalEl => {
    //   modalEl.onDidDismiss().then(modalData => {
    //     if (!modalData.data) {
    //       return;
    //     }
    //     // if should return service selected
    //     const assistantData = {
    //       assistantId: userId,
    //       selectedServices: modalData.data.selectedServices,
    //       subTotal: modalData.data.subTotal
    //     };
    //     localStorage.setItem('assistant', JSON.stringify(assistantData));
    //     // redirect to next steps
    //     this.onNext('schedule');
    //   });
    //   modalEl.present();
    // });
  }
}
