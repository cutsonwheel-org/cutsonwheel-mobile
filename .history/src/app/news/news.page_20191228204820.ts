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
  public news$: Observable<News[]>;

  constructor(
    private newsService: NewsService
  ) {}

  ngOnInit() {
    this.news$ = this.newsService.getNewsData();
  }

  onNewsDetail(newsId: string, newsUrl: string) {
    console.log(newsId);
    console.log(newsUrl);
  }

  loadData(event) {

    const infiniteScroll = document.getElementById('infinite-scroll');

    this.news$.subscribe(result => {
      const length = 0;
      if (length <  result.length) {
        console.log('Loading data...');
        this.wait(500);
        event.target.complete();
        this.appendItems(10, result);
        console.log('Done');
      } else {
        console.log('No More Data');
        event.target.disabled = true;
      }
    });
  }

  appendItems(num: number, data: any) {
    const list = document.getElementById('list');
    console.log('length is', length);
    const originalLength = length;
    for (let i = 0; i < num; i++) {
      const el = document.createElement('ion-item');
      el.innerHTML = `
        <ion-avatar slot="start">
          <img src="https://www.gravatar.com/avatar/${i + originalLength}?d=monsterid&f=y">
        </ion-avatar>
        <ion-label>
          <h2>${data[i + originalLength].name}</h2>
          <p>Created ${data[i + originalLength].created}</p>
        </ion-label>
      `;
      list.appendChild(el);
      length++;
    }
  }

  wait(time: number) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }
}
