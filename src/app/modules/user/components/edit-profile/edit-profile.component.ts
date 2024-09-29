import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  editProfileForm: FormGroup;
  user: any = {}; 
  cities: any[] = []; 
  loading: boolean = false; 

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {
    this.editProfileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      location: ['', Validators.required], 
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadCities(); 
  }

 
  loadUserProfile() {
    const userName = this.authService.getUser();
    if (userName) {
      this.http.get(`http://localhost:3001/users?name=${userName}`).subscribe((userData: any) => {
        this.user = userData[0];
        this.editProfileForm.patchValue({
          name: this.user.name,
          email: this.user.email,
          location: this.user.location,
        });
      });
    }
  }

  
  loadCities() {
    this.loading = true;
    this.http.get<any[]>('assets/cities.json').subscribe(
      (data) => {
        this.cities = data; 
        this.loading = false;
      },
      (error) => {
        console.error('Erreur lors du chargement des villes', error);
        this.loading = false;
      }
    );
  }

  onSubmit() {
    if (this.editProfileForm.valid) {
      const updatedData = { ...this.user, ...this.editProfileForm.value };
      this.http.put(`http://localhost:3001/users/${this.user.id}`, updatedData).subscribe(() => {
        alert('Profil mis à jour avec succès');
        this.router.navigate(['/']); 
      });
    }
  }
}
