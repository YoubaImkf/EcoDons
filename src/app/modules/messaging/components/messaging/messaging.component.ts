import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.scss']
})
export class MessagingComponent implements OnInit {
  selectedConversationId!: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['conversationId']) {
        this.selectedConversationId = params['conversationId'];
      }
    });
  }

  onConversationSelected(conversationId: string): void {
    this.selectedConversationId = conversationId;
  }
}
