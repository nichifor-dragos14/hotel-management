import { SearchHistoryFields } from '$backend/services';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SearchHistoryService {
  AddSearchToSearchHistory(search: string) {
    if (!search) {
      return;
    }

    let searchHistoryString = localStorage.getItem('SearchHistory');
    let searchHistory = searchHistoryString?.split(';');

    if (!searchHistory) {
      localStorage.setItem('SearchHistory', search + ';');

      return;
    }

    if (searchHistory.length < 10) {
      searchHistoryString += search + ';';
      localStorage.setItem('SearchHistory', searchHistoryString!);

      return;
    }

    for (let i = 1; i <= 9; i++) {
      searchHistory[i - 1] = searchHistory[i];
    }

    searchHistory[9] = search;
    searchHistoryString = searchHistory.join(';');
    localStorage.setItem('SearchHistory', searchHistoryString);
  }

  GetSearchHistory(): SearchHistoryFields[] {
    let searchHistoryString = localStorage.getItem('SearchHistory');

    if (!searchHistoryString) {
      return [];
    }

    let searchHistory = searchHistoryString.split(';');
    let searchHistoryArray: SearchHistoryFields[] = [];

    searchHistory.forEach((element) => {
      if (element != '') {
        let field: SearchHistoryFields = JSON.parse(element);

        searchHistoryArray.push({
          location: field.location,
          numberOfAdults: field.numberOfAdults,
          numberOfChildren: field.numberOfChildren,
          numberOfRooms: field.numberOfRooms,
        });
      }
    });

    return searchHistoryArray;
  }

  RemoveSearchHistory() {
    localStorage.removeItem('SearchHistory');
  }
}
