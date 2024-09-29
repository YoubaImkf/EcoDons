import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MessagingService } from '../../modules/messaging/services/messaging.service'; 
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  userName: string | null = '';
  unreadMessagesCount: number = 0; 
  private pollingSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private messagingService: MessagingService, 
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
    });
    this.authService.userName$.subscribe((name: string | null) => {
      this.userName = name;
    });
    this.pollingSubscription = interval(2000).subscribe(() => {
      if (this.isLoggedIn) {
        this.checkUnreadMessages();
      }
    });
  }

  checkUnreadMessages() {
    this.messagingService.getConversations().subscribe((conversations) => {
      this.unreadMessagesCount = conversations.reduce((count, conv) => {
        if (conv.unreadMessagesFor.includes(this.authService.getUser()!)) {
          return count + 1;
        }
        return count;
      }, 0);
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  navigateToMyAds() {
    this.router.navigate(['/items/my-ads']);
  }

  navigateToEditProfile() {
    this.router.navigate(['/user/edit-profile']);
  }

  ngOnDestroy(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }
}


