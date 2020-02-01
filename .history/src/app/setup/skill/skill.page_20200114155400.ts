import { Component, OnInit } from '@angular/core';
import { Classifications } from 'src/app/classifications/classifications';
import { Observable } from 'rxjs';
import { ClassificationsService } from 'src/app/classifications/classifications.service';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/users/users.service';

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
  classificationSelected: string;
  experienceLevel: string;

  constructor(
    private classificationsService: ClassificationsService,
    private usersService: UsersService,
    private router: Router
  ) { }

  ngOnInit() {
    this.classifications = this.classificationsService.getClassifications();
  }

  onPickedSkill(classification: string) {
    this.classificationSelected = classification;
  }

  levelSelected(event: CustomEvent) {
    this.experienceLevel = event.detail.value;
  }

  onNext() {
    if (!this.classificationSelected || !this.experienceLevel) {
      return;
    }
    const data = {
      skills: {
        name: this.classificationSelected,
        level: this.experienceLevel
      }
    };
    console.log(data);
    this.usersService.update(data).then(() => {
      // skill select
      // experience
      // language
      this.router.navigateByUrl('home');
    });
  }
}
