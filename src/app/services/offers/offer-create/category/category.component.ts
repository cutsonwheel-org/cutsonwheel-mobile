import { Component, OnInit } from '@angular/core';
import { CategoriesService } from 'src/app/shared/services/categories.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Categories } from 'src/app/shared/class/categories';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  public categories$: Observable<Categories[]>;
  isLoading: boolean;

  constructor(
    private modalCtrl: ModalController,
    public categoriesService: CategoriesService,
  ) {
    this.isLoading = true;
  }

  ngOnInit() {
    
    this.categories$ = this.categoriesService.getAll();
    this.categories$.subscribe(() => {
      this.isLoading = false;
    });

  }

  separateCategory(record, recordIndex, records) {
    if (recordIndex === 0) {
      return record.name[0].toUpperCase();
    }

    const firstPrev = records[recordIndex - 1].name[0];
    const firstCurrent = record.name[0];

    if (firstPrev !== firstCurrent) {
      return firstCurrent.toUpperCase();
    }

    return null;
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onCategorySelected(category: string) {
    this.modalCtrl.dismiss(
      {
        selectedCategory: category
      },
      'confirm'
    );
  }

}
