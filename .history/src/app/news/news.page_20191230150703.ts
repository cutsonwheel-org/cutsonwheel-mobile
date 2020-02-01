import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { News } from './news';
import { NewsService } from './news.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit, OnDestroy {
  public news$: Observable<News[]>;
  public news: any;
  private newsSub: Subscription;
  constructor(
    private newsService: NewsService
  ) {}

  ngOnInit() {
    this.newsSub = this.newsService.getNewsData().subscribe((news) => {
      this.news = news;
    });

  }

  ngOnDestroy() {
    this.newsSub.unsubscribe();
  }
}
