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
  public newsData: Observable<News[]>;

  constructor(
    private newsService: NewsService
  ) {}

  ngOnInit() {
    this.newsData = this.newsService.getNewsData();
  }

}
