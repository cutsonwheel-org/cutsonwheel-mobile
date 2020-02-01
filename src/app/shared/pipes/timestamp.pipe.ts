import { Pipe, PipeTransform, LOCALE_ID, Inject } from '@angular/core';
import {firestore} from 'firebase/app';
import Timestamp = firestore.Timestamp;
import { formatDate } from '@angular/common';

@Pipe({
  name: 'timestamp'
})
export class TimestampPipe implements PipeTransform {

  constructor(
    @Inject(LOCALE_ID) private locale: string
  ) {}

  transform(value: Timestamp, format?: string): any {
    return formatDate(value.toDate(), format || 'medium', this.locale);
  }

}
