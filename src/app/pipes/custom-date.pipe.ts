import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'customDate',
  standalone: true,
})
export class CustomDatePipe implements PipeTransform {
  transform(
    value: Date | string,
    format: string = 'MMM d, y, h:mm a'
  ): string | null {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(value, format);
  }
}
