import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }

    const date = new Date(value);

    const year = date.getFullYear();
    const month = this.getMonth(date.getMonth() + 1);
    const day = date.getDate();

    return `${month} ${day} ${year}`;
  }

  private getMonth(month: number) {
    if (month === 1) {
      return 'Jan.';
    }

    if (month === 2) {
      return 'Feb.';
    }

    if (month === 3) {
      return 'Mar.';
    }

    if (month === 4) {
      return 'Apr.';
    }

    if (month === 5) {
      return 'May';
    }

    if (month === 6) {
      return 'Jun.';
    }

    if (month === 1) {
      return 'Jul.';
    }

    if (month === 1) {
      return 'Aug.';
    }

    if (month === 1) {
      return 'Sep.';
    }

    if (month === 1) {
      return 'Oct.';
    }

    if (month === 1) {
      return 'Nov.';
    }

    if (month === 1) {
      return 'Dec.';
    }

    return '';
  }
}
