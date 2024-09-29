import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessagingService } from '../../services/messaging.service';
import { AuthService } from '../../../../services/auth.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnInit, OnDestroy, OnChanges {
  @Input() conversationId!: string;
  conversation: any;
  currentUserId: string | null = null;
  messageForm!: FormGroup;
  private pollingSubscription!: Subscription;
  otherUser: { userId: string; name: string } | undefined;
  displayedMessages: string[] = [];

  constructor(
    private fb: FormBuilder,
    private messagingService: MessagingService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getUser();
    this.messageForm = this.fb.group({
      message: ['', Validators.required]
    });
    this.pollingSubscription = interval(1000).subscribe(() => {
      this.loadConversation();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conversationId']) {
      this.loadConversation();
    }
  }

  loadConversation(): void {
    this.messagingService.getConversationById(this.conversationId).subscribe(conversation => {
      this.conversation = conversation;
      this.otherUser = this.conversation?.users.find(
        (user: { userId: string; name: string }) => user.userId !== this.currentUserId
      );
      this.conversation.messages.forEach((message: any) => {
        if (!this.displayedMessages.includes(message.id)) {
          this.displayedMessages.push(message.id); 
        }
      });
      
      this.scrollToBottom();
    });
  }

  sendMessage(): void {
    if (this.messageForm.valid) {
      const content = this.messageForm.get('message')?.value;
      if (this.conversation) {
        this.messagingService.sendMessage(this.conversation.id, content, this.currentUserId!).subscribe(() => {
          this.messageForm.reset();
          this.scrollToBottom();
        });
      }
    }
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const chatMessages = document.querySelector('.chat-messages');
      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }
}
