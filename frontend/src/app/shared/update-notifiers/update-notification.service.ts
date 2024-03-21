import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private reloadNotification$ = new Subject<void>();

  get onReloadNotification() {
    return this.reloadNotification$.asObservable();
  }

  triggerReload() {
    this.reloadNotification$.next();
  }
}
