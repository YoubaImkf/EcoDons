import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { NotificationService } from '../../../../shared/notification.service';

@Component({
  selector: 'app-create-ad',
  templateUrl: './create-ad.component.html',
  styleUrls: ['./create-ad.component.scss']
})
export class CreateAdComponent implements OnInit {
  createAdForm: FormGroup;
  selectedFile: File | null = null;
  userId: string | null = null; 
  cities: any[] = [];
  categories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService 
  ) {
    this.createAdForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserId(); 
    this.loadCities();
    this.loadCategories(); 
  }

 
  loadUserId() {
    const userName = this.authService.getUser(); 
    if (userName) {
      this.http.get<any[]>(`http://localhost:3001/users?name=${userName}`).subscribe(
        (users) => {
          if (users.length > 0) {
            this.userId = users[0].id; 
          }
        },
        (error) => {
          this.notificationService.sendNotification('Erreur lors de la récupération de l\'utilisateur', 'error');
        }
      );
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (this.createAdForm.valid && this.userId) {
      const formData = this.createAdForm.value;
      formData.donor_id = this.userId;
      formData.status = 'disponible';

      if (this.selectedFile) {
        const uploadData = new FormData();
        uploadData.append('photo', this.selectedFile);

        
        this.http.post<{ filePath: string }>('http://localhost:3000/upload', uploadData).subscribe(response => {
          formData.photo = `http://localhost:3000${response.filePath}`; 
          this.saveAd(formData);
        }, error => {
          this.notificationService.sendNotification('Erreur lors du téléchargement du fichier', 'error');
        });
      } else {
        formData.photo = 'assets/items/default.jpeg';
        this.saveAd(formData);
      }
    } else {
      this.notificationService.sendNotification('Formulaire invalide ou utilisateur non identifié. Veuillez remplir tous les champs.', 'error');
    }
  }

  private saveAd(formData: any) {
    this.http.post('http://localhost:3001/items', formData).subscribe(() => {
      this.notificationService.sendNotification('Annonce créée avec succès', 'success');
      this.router.navigate(['/home']);
    }, error => {
      this.notificationService.sendNotification('Erreur lors de la création de l\'annonce', 'error');
    });
  }

  
  cancel() {
    if (confirm('Êtes-vous sûr de vouloir annuler ?')) {
      this.router.navigate(['/home']);
    }
  }

  loadCities(): void {
    this.http.get<any[]>('assets/cities.json').subscribe((data) => {
      this.cities = data;
    });
  }


  loadCategories(): void {
    this.http.get<any[]>('assets/categories.json').subscribe((data) => {
      this.categories = data;
    });
  }
}
