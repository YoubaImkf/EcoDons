import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MessagingRoutingModule } from './messaging-routing.module';
import { ChatListComponent } from './components/chat-list/chat-list.component';
import { ChatWindowComponent } from './components/chat-window/chat-window.component';
import { MessagingComponent } from './components/messaging/messaging.component';

@NgModule({
  declarations: [
    ChatListComponent,  // Ensure this is listed
    ChatWindowComponent,  // Ensure this is listed
    MessagingComponent  // Ensure this is listed
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MessagingRoutingModule
  ]
})
export class MessagingModule {}
