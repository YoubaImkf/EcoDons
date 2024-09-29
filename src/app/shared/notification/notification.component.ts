import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  message: string = '';
  type: 'success' | 'error' | 'info' = 'info'; 
  showNotification: boolean = false;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.getNotification().subscribe(notification => {
      this.message = notification.message;
      this.type = notification.type;
      this.showNotification = true;
      setTimeout(() => {
        this.showNotification = false;
      }, 3000);
    });
  }

  closeNotification() {
    this.showNotification = false;
  }
}
export { NotificationService };

