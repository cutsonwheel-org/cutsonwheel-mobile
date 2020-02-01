import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from '../news.service';
import { News } from '../news';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.page.html',
  styleUrls: ['./news-detail.page.scss'],
})
export class NewsDetailPage implements OnInit {
  isLoading: boolean;
  news: News;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private newsService: NewsService
  ) {
    this.isLoading = false;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('newsId')) {
        this.navCtrl.navigateBack('/t/news');
        return;
      }
      this.isLoading = true;
      this.newsService.getNewsDetail(paramMap.get('newsId')).subscribe((news) => {
        this.isLoading = false;
        this.news = news;
      });
    });
  }

}
