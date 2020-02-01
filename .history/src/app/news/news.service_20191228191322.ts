import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

import {
  AngularFirestoreCollection,
  AngularFirestore,
  DocumentReference
} from '@angular/fire/firestore';
import { News } from './news';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private news: Observable<News[]>;
  private newsCollection: AngularFirestoreCollection<News>;

  constructor(
    private afs: AngularFirestore
  ) {
    this.newsCollection = this.afs.collection<News>('news');
    this.news = this.newsCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getNewsData(): Observable<News[]> {
    return this.news;
  }

  getNewsDetail(id: string): Observable<News> {
    return this.newsCollection.doc<News>(id).valueChanges().pipe(
      take(1),
      map(news => {
        news.id = id;
        return news;
      })
    );
  }

  insertNews(offer: any): Promise<DocumentReference> {
    return this.newsCollection.add(offer);
  }

  updateNews(news: any): Promise<void> {
    return this.newsCollection.doc(news.id).update({
      title: news.title,
      description: news.description,
      type: news.type,
      url: news.url,
      published: news.published
    });
  }

  deleteNews(id: string): Promise<void> {
    return this.newsCollection.doc(id).delete();
  }

}
