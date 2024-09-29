import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MessagingService, Conversation } from '../../services/messaging.service';
import { AuthService } from '../../../../services/auth.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit, OnDestroy {
  conversations: Conversation[] = [];
  currentUserId: string = ''; 

  @Output() conversationSelected = new EventEmitter<string>();
  private pollingSubscription!: Subscription; 

  constructor(
    private messagingService: MessagingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUser();
    if (userId) {
      this.currentUserId = userId; 
    }

    if (!this.currentUserId) {
      console.error('Utilisateur non connecté');
      return;
    }

   
    this.messagingService.getConversationsUpdates().subscribe((conversations) => {
      this.conversations = this.sortConversations(conversations);
    });

    this.pollingSubscription = interval(1000).subscribe(() => {
      this.messagingService.getConversations().subscribe((conversations) => {
        this.conversations = this.sortConversations(conversations);
      });
    });

    
    this.messagingService.getConversations().subscribe((conversations) => {
      this.conversations = this.sortConversations(conversations);
    });
  }


  openChat(conversationId: string): void {
    this.conversationSelected.emit(conversationId);


    this.messagingService.markMessagesAsRead(conversationId, this.currentUserId).subscribe();
  }


  private sortConversations(conversations: Conversation[]): Conversation[] {
    return conversations.sort((a, b) => {
      const aUnread = a.unreadMessagesFor.includes(this.currentUserId);
      const bUnread = b.unreadMessagesFor.includes(this.currentUserId);

      if (aUnread && !bUnread) return -1; 
      if (!aUnread && bUnread) return 1;

      
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
    });
  }

  getOtherUser(conversation: Conversation): string {
    const otherUser = conversation.users.find(user => user.userId !== this.currentUserId);
    return otherUser ? otherUser.name : 'Utilisateur inconnu';
  }

 
  getLastMessage(conversation: Conversation): string {
    if (conversation.messages.length > 0) {
      return conversation.messages[conversation.messages.length - 1].content;
    }
    return 'Pas de messages';
  }

  ngOnDestroy(): void {
    
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }
}

