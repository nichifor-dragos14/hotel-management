import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    const date = new Date(value);
    const year = date.getFullYear();
    const month = this.padNumber(date.getMonth() + 1);
    const day = this.padNumber(date.getDate());
    return `${year}/${month}/${day}`;
  }

  private padNumber(num: number): string {
    return num < 10 ? '0' + num : '' + num;
  }
}
