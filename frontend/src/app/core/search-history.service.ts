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

  GetSearchHistory(): string[] {
    let searchHistoryString = localStorage.getItem('SearchHistory');

    if (!searchHistoryString) {
      return [];
    }

    return searchHistoryString.split(';');
  }

  RemoveSearchHistory() {
    localStorage.removeItem('SearchHistory');
  }
}
