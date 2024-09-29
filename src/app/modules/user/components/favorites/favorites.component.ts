import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../shared/notification.service'; 

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent implements OnInit {
  favorites: any[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService 
  ) {}

  ngOnInit(): void {
    const userName = this.authService.getUser(); 

    this.http.get<any[]>(`http://localhost:3001/users?name=${userName}`).subscribe((users: any[]) => {
      if (users.length > 0) {
        const user = users[0]; 
        const favoriteIds = user.favorites || [];
        this.loadFavorites(favoriteIds); 
      }
    });
  }

  loadFavorites(favoriteIds: string[]): void {
    this.favorites = []; 
    if (favoriteIds.length === 0) {
      this.notificationService.sendNotification("Vous n'avez aucun favori.", 'info'); 
    } else {
      favoriteIds.forEach((id) => {
        this.http.get<any>(`http://localhost:3001/items/${id}`).subscribe((item: any) => {
          this.favorites.push(item); 
        });
      });
    }
  }


  viewItemDetails(itemId: string) {
    this.router.navigate([`/items/${itemId}`]); 
  }

  removeFromFavorites(itemId: string): void {
    const userName = this.authService.getUser(); 
  
    this.http.get<any[]>(`http://localhost:3001/users?name=${userName}`).subscribe((users: any[]) => {
      if (users.length > 0) {
        const user = users[0]; 
        const updatedFavorites = user.favorites.filter((favId: string) => favId !== itemId);
        user.favorites = updatedFavorites; 
  
        this.http.put(`http://localhost:3001/users/${user.id}`, user).subscribe(() => {
          this.favorites = this.favorites.filter(fav => fav.id !== itemId); 
          this.notificationService.sendNotification('Annonce retirée des favoris', 'success');
        });
      }
    });
  }

  navigateToBrowseAds() {
    this.router.navigate(['/']); 
  }

}
