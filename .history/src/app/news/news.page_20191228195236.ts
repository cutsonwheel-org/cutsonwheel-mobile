import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { News } from './news';
import { NewsService } from './news.service';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;
  public newsData: Observable<News[]>;

  constructor(
    private newsService: NewsService
  ) {}

  ngOnInit() {
    this.newsData = this.newsService.getNewsData();
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      this.newsData.subscribe(result => {
        if ( result.length === 1000) {
          event.target.disabled = true;
        }
      });
    }, 500);
  }
}
