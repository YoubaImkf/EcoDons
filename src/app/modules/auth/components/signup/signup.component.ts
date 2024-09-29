import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; 

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  cities: any[] = []; 
  loading: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private http: HttpClient) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      location: ['', Validators.required], 
    });
  }

  ngOnInit(): void {
    this.loadCities(); 
  }

  
  loadCities() {
    this.loading = true;
    this.http.get<any[]>('assets/cities.json') 
      .subscribe(
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
    if (this.signupForm.valid) {
      
      const userData = {
        ...this.signupForm.value,
        favorites: [] 
      };
      this.authService.signup(userData).subscribe(
        () => {
          this.router.navigate(['/auth/login']); 
        },
        (err) => console.log(err)
      );
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
}

