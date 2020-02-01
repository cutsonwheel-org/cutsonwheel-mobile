import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { News } from './news';
import { NewsService } from './news.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
  public news$: Observable<News[]>;
  public news: any[];
  constructor(
    private newsService: NewsService
  ) {}

  ngOnInit() {
    this.newsService.getNewsData().subscribe((news) => {
      this.news.push(news);
    });

  }

}
