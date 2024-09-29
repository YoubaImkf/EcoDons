import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<Notification>({ message: '', type: 'info' });

  
  sendNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.notificationSubject.next({ message, type });
  }

 
  getNotification(): Observable<Notification> {
    return this.notificationSubject.asObservable();
  }
}
