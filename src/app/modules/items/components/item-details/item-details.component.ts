import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../services/auth.service';
import { NotificationService } from '../../../../shared/notification.service'; 
import { MessagingService } from '../../../messaging/services/messaging.service';
import { Conversation } from '../../../messaging/services/messaging.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent implements OnInit {
  item: any; 

  constructor(
    private router: Router,
    private route: ActivatedRoute, 
    private http: HttpClient, 
    private authService: AuthService,
    private notificationService: NotificationService, 
    private messagingService: MessagingService, 
  ) {}

  ngOnInit(): void {
    const itemId = this.route.snapshot.paramMap.get('id'); 
    this.http.get(`http://localhost:3001/items/${itemId}`).subscribe(
      (data: any) => {
        this.item = data; 
      },
      (error) => {
        this.notificationService.sendNotification('Erreur lors du chargement de l\'annonce', 'error');
      }
    );
  }

  addToFavorites(itemId: string): void {
    const userName = this.authService.getUser();
    this.http.get<any[]>(`http://localhost:3001/users?name=${userName}`).subscribe((users: any[]) => {
      if (users.length > 0) {
        const user = users[0]; 
        if (!user.favorites.includes(itemId)) {
          user.favorites.push(itemId); 

          this.http.put(`http://localhost:3001/users/${user.id}`, user).subscribe(() => {
            this.notificationService.sendNotification('Annonce ajoutée aux favoris', 'success');
          });
        } else {
          this.notificationService.sendNotification('Cette annonce est déjà dans vos favoris', 'info');
        }
      }
    });
  }

  contactDonor(item: any): void {
    const currentUserId = this.authService.getUser();
    if (!currentUserId) {
      this.notificationService.sendNotification('Vous devez être connecté pour contacter un utilisateur.', 'error'); 
      this.router.navigate(['/auth/login']);
      return;
    }
  
    const donorId = item.donor_id;
    this.messagingService.getConversationByUsersAndItem(currentUserId, donorId, item.id).subscribe((conversation: Conversation | undefined) => {
      if (conversation) {
        this.router.navigate(['/messaging'], { queryParams: { conversationId: conversation.id } });
      } else {
        this.messagingService.createConversation(currentUserId, donorId, item).subscribe(newConversation => {
          this.router.navigate(['/messaging'], { queryParams: { conversationId: newConversation.id } });
        });
      }
    });
  }
}


