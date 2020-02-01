import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { News } from './news';
import { NewsService } from './news.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
  // public news$: Observable<News[]>;
  latestNews = [];
  constructor(
    private newsService: NewsService,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    this.newsService.getAll().subscribe((news) => {
      news.forEach(element => {
        this.latestNews.push(element);
      });
    });
  }

  loadNews(event) {
    const length = 0;
    this.newsService.getAll().subscribe((news) => {

      news.forEach(element => {
        this.latestNews.push(element);
      });
      event.target.complete();
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (length < this.latestNews.length) {
        this.toastCtrl.create({
          message: 'All news loaded!',
          duration: 2000
        }).then(toast => toast.present());
        event.target.disabled = true;
      }
    });
  }
}
