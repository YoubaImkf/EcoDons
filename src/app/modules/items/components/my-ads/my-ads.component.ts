import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../shared/notification.service'; 

@Component({
  selector: 'app-my-ads',
  templateUrl: './my-ads.component.html',
  styleUrls: ['./my-ads.component.scss'],
})
export class MyAdsComponent implements OnInit {
  myAds: any[] = [];
  showModal: boolean = false; 
  adIdToDelete: string | null = null; 

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
        const donorId = user.id; 

        this.http.get<any[]>(`http://localhost:3001/items?donor_id=${donorId}`).subscribe((ads: any[]) => {
          this.myAds = ads;
        });
      }
    });
  }

  openDeleteModal(adId: string): void {
    this.adIdToDelete = adId;
    this.showModal = true; 
  }

  confirmDelete(confirmed: boolean): void {
    this.showModal = false; 
    if (confirmed && this.adIdToDelete) {
      this.http.delete(`http://localhost:3001/items/${this.adIdToDelete}`).subscribe(() => {
        this.myAds = this.myAds.filter(ad => ad.id !== this.adIdToDelete);
        this.notificationService.sendNotification('Annonce supprimée', 'success');
        this.adIdToDelete = null;
      }, error => {
        this.notificationService.sendNotification('Erreur lors de la suppression de l\'annonce', 'error');
      });
    }
  }

  changeStatus(adId: string, currentStatus: string): void {
    const newStatus = currentStatus === 'disponible' ? 'donné' : 'disponible';

    this.http.patch(`http://localhost:3001/items/${adId}`, { status: newStatus }).subscribe(() => {
      const ad = this.myAds.find(ad => ad.id === adId);
      if (ad) {
        ad.status = newStatus;
      }
      this.notificationService.sendNotification('Statut de l\'annonce mis à jour', 'success');
    }, error => {
      this.notificationService.sendNotification('Erreur lors de la mise à jour du statut', 'error');
    });
  }

  navigateToCreateAd() {
    this.router.navigate(['/items/create-ad']); 
  }
}
