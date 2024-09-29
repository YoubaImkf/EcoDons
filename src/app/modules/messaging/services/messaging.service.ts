import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../modules/user/services/user.service';
import { NotificationService } from '../../../shared/notification/notification.component'; 

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  users: { userId: string; name: string }[];
  lastUpdated: string;
  announcement: any;
  messages: Message[];
  unreadMessagesFor: string[];
  
}

@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  private conversationsUrl = 'http://localhost:3001/conversations'; 
  private conversations: Conversation[] = [];

  
  private conversationsSubject = new Subject<Conversation[]>();
  private messageUpdatesSubject = new Subject<Conversation>();


  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.loadConversations();
  }

  private loadConversations(): void {
    this.http.get<Conversation[]>(this.conversationsUrl).subscribe((conversations) => {
      this.conversations = conversations;
      this.conversationsSubject.next(this.conversations);
    });
  }

  getMessageUpdates(): Observable<Conversation> {
    return this.messageUpdatesSubject.asObservable();
  }


  getConversationsUpdates(): Observable<Conversation[]> {
    return this.conversationsSubject.asObservable();
  }

  getConversations(): Observable<Conversation[]> {
    const currentUserId = this.authService.getUser(); 
    
    if (!currentUserId) {
      console.error('Utilisateur non connecté');
      return of([]); 
    }
  
    console.log("Récupération des conversations pour l'utilisateur:", currentUserId);
  
    return this.http.get<Conversation[]>(this.conversationsUrl).pipe(
      map((conversations) => {
        console.log("Conversations récupérées depuis l'API:", conversations); 
        conversations.forEach(conversation => {
          console.log("Conversation ID:", conversation.id);
          conversation.users.forEach(user => {
            console.log("User ID dans la conversation:", user.userId, "Nom:", user.name);
          });
        });
        
        const filteredConversations = conversations.filter((conv) =>
          conv.users.some((user) => {
            console.log(`Comparaison des userId : ${user.userId} === ${currentUserId}`);
            return user.userId === currentUserId;
          })
        );
        
        console.log("Conversations filtrées pour", currentUserId, ":", filteredConversations);
        return filteredConversations;
      }),
      map((conversations) =>
        conversations.sort((a, b) => {
          const aUnread = a.unreadMessagesFor.includes(currentUserId);
          const bUnread = b.unreadMessagesFor.includes(currentUserId);
  
          if (aUnread && !bUnread) return -1;
          if (!aUnread && bUnread) return 1;
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        })
      )
    );
  }
  

  getConversationById(conversationId: string): Observable<Conversation | undefined> {
    return this.http.get<Conversation>(`${this.conversationsUrl}/${conversationId}`);
  }

   
 

createConversation(userId1: string, userId2: string, item: any): Observable<Conversation> {
  console.log("Création de conversation entre userId1:", userId1, "et userId2:", userId2);
  if (userId1 === userId2) {
    console.error("Un utilisateur ne peut pas créer une conversation avec lui-même.");
    alert("Vous ne pouvez pas contacter vous-même.");
    return throwError(() => new Error("Impossible de créer une conversation avec soi-même"));
  }

  return this.userService.getUserById(userId2).pipe(
    switchMap((user2) => {
      const newConversation: Conversation = {
        id: Math.random().toString(36).substring(7),
        users: [
          { userId: userId1, name: this.authService.getUserName() || 'Utilisateur 1' },
          { userId: user2.name, name: user2.name }
        ],
        lastUpdated: new Date().toISOString(),
        announcement: item,
        messages: [],
        unreadMessagesFor: [user2.id], 
      };
      console.log("Nouvelle conversation:", newConversation);
      return this.http.post<Conversation>(this.conversationsUrl, newConversation).pipe(
        map(() => {
          console.log("Nouvelle conversation ajoutée à la liste des conversations locales");
          this.conversations.push(newConversation);
          this.conversationsSubject.next(this.conversations);
          return newConversation;
        })
      );
    })
  );
}

  

  

  sendMessage(conversationId: string, content: string, senderId: string): Observable<Conversation> {
    return this.getConversationById(conversationId).pipe(
      switchMap(conversation => {
        if (conversation) {
          const newMessage: Message = {
            id: Math.random().toString(36).substring(7),
            senderId,
            content,
            timestamp: new Date().toISOString(),
            read: false
          };
  
          conversation.messages.push(newMessage);
          conversation.lastUpdated = new Date().toISOString();
  
          const recipientId = conversation.users.find(user => user.userId !== senderId)?.userId;
          if (recipientId && !conversation.unreadMessagesFor.includes(recipientId)) {
            conversation.unreadMessagesFor.push(recipientId);
          }
  
          return this.http.put<Conversation>(`${this.conversationsUrl}/${conversation.id}`, conversation).pipe(
            map(updatedConversation => {
              this.messageUpdatesSubject.next(updatedConversation); 
              return updatedConversation;
            })
          );
        } else {
          throw new Error('Conversation non trouvée');
        }
      })
    );
  }
getConversationByUsersAndItem(userId1: string, userId2: string, itemId: string): Observable<Conversation | undefined> {
  return this.http.get<Conversation[]>(this.conversationsUrl).pipe(
    map(conversations => conversations.find(conv =>
      conv.users.some(user => user.userId === userId1) &&
      conv.users.some(user => user.userId === userId2) &&
      conv.announcement.id === itemId
    ))
  );
}

markMessagesAsRead(conversationId: string, userId: string): Observable<Conversation> {
  console.log("Marquer les messages comme lus pour la conversation:", conversationId, "par l'utilisateur:", userId);

  return this.getConversationById(conversationId).pipe(
    switchMap(conversation => {
      if (conversation) {
        console.log("Conversation trouvée:", conversation);

        conversation.messages.forEach(message => {
          if (message.senderId !== userId) {
            message.read = true;  
          }
        });
        conversation.unreadMessagesFor = conversation.unreadMessagesFor.filter(id => id !== userId);
        console.log("Conversation après avoir marqué comme lus:", conversation);
        return this.http.put<Conversation>(`${this.conversationsUrl}/${conversation.id}`, conversation).pipe(
          map(updatedConversation => {
            console.log("Conversation mise à jour après lecture des messages:", updatedConversation);
            this.messageUpdatesSubject.next(updatedConversation);
            return updatedConversation;
          })
        );
      } else {
        console.error("Conversation non trouvée:", conversationId);
        throw new Error('Conversation not found');
      }
    })
  );
}

checkIfOtherUserIsTyping(conversationId: string, otherUserId: string): Observable<boolean> {
  return this.http.get<boolean>(`${this.conversationsUrl}/${conversationId}/typing/${otherUserId}`);
}

sendTypingNotification(conversationId: string, isTyping: boolean): void {
  const currentUserId = this.authService.getUser();
  this.http.post(`${this.conversationsUrl}/${conversationId}/typing`, { userId: currentUserId, isTyping }).subscribe();
}
}






