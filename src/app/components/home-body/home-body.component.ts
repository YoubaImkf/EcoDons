import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { MessagingService } from '../../modules/messaging/services/messaging.service';
import { Conversation } from '../../modules/messaging/services/messaging.service';
import { NotificationService } from '../../shared/notification.service'; 

@Component({
  selector: 'app-home-body',
  templateUrl: './home-body.component.html',
  styleUrls: ['./home-body.component.scss'],
})
export class HomeBodyComponent implements OnInit {
  isLoggedIn: boolean = false;
  userName: string | null = '';
  items: any[] = [];
  filteredItems: any[] = [];
  searchTerm: string = '';
  selectedCity: string = '';
  selectedCategory: string = '';
  selectedStatus: string = '';

  cities: string[] = [];
  categories: string[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private messagingService: MessagingService, 
    private notificationService: NotificationService 
  ) {}
  
  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userName = this.authService.getUser();
    
    if (this.isLoggedIn) {
      this.loadItems(); 
      this.loadFilters();
    }
  }

  loadItems() {
    this.http.get<any[]>('http://localhost:3001/items').subscribe(
      (data) => {
        this.items = data;
        this.filteredItems = data; 
      },
      (error) => {
        console.error('Erreur lors du chargement des annonces', error);
      }
    );
  }

  loadFilters() {
    this.http.get<any[]>('assets/cities.json').subscribe((data) => {
      this.cities = data.map(city => city.name); 
    });
    this.http.get<any[]>('assets/categories.json').subscribe((data) => {
      this.categories = data.map(category => category.name); 
    });
  }

  filterItems() {
    this.filteredItems = this.items.filter(item => {
      const matchesSearch = this.searchTerm ? item.title.toLowerCase().includes(this.searchTerm.toLowerCase()) : true;
      const matchesCity = this.selectedCity ? item.location.toLowerCase() === this.selectedCity.toLowerCase() : true;
      const matchesCategory = this.selectedCategory ? item.category === this.selectedCategory : true;
      const matchesStatus = this.selectedStatus ? item.status === this.selectedStatus : true;

      return matchesSearch && matchesCity && matchesCategory && matchesStatus;
    });
  }

  viewItemDetails(itemId: string) {
    this.router.navigate([`/items/${itemId}`]);
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

  navigateToSignup() {
    this.router.navigate(['/auth/signup']);
  }

  navigateToLogin() {
    this.router.navigate(['/auth/login']);
  }

  navigateToCreateAd() {
    this.router.navigate(['/items/create-ad']);
  }
  
  navigateToMyAds() {
    this.router.navigate(['/items/my-ads']);
  }

  contactDonor(item: any): void {
    const currentUserId = this.authService.getUser();
    if (!currentUserId) {
      this.notificationService.sendNotification('Vous devez être connecté pour contacter un utilisateur.', 'error');
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
