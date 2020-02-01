import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
  items: Observable<any[]>;
  constructor(
    private db: AngularFirestore
  ) {
    this.items = db.collection('bookings').valueChanges();
   }

  ngOnInit() {
  }

}
