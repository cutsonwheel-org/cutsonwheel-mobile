import { Component, OnInit } from '@angular/core';
import { NewsService } from './news.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
  latestNews = [];
  isLoading: boolean;

  constructor(
    private newsService: NewsService,
    private toastCtrl: ToastController,
  ) {
    this.isLoading = true;
  }

  ngOnInit() {
    this.loadNews();
  }

  loadNews(event?) {
    this.newsService.getAll().subscribe((news) => {
      this.isLoading = false;
      // this is an options
      this.latestNews = this.latestNews.concat(news);

      if (event) {
        event.target.complete();
      }
    });
  }

  loadMore(event) {
    const length = 0;
    this.loadNews(event);
    if (length < this.latestNews.length) {
      this.toastCtrl.create({
        message: 'All news loaded!',
        duration: 2000
      }).then(toast => toast.present());
      event.target.disabled = true;
    }
  }

}
