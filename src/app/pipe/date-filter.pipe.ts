import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortingPipe implements PipeTransform {
  transform(sortArray: any[], property: string, method: 'asc' | 'desc' = 'asc'): any {
    const result = [...sortArray]; // clone the array

    if (method === 'desc') {
      return result.sort((a, b) => a[property] > b[property] ? 1 : -1);
    } else {
      return result.sort((a, b) => a[property] < b[property] ? 1 : -1);

    }
  }
}

//this sorting method used for menus