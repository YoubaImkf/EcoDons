import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.loginForm.statusChanges.subscribe(status => {
      console.log('Login Form Status:', status); 
      console.log('Login Form Value:', this.loginForm.value); 
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        (res) => {
          if (res.length > 0 && res[0].password === this.loginForm.value.password) {
            this.authService.storeToken('fake-jwt-token');
            this.authService.storeUser(res[0].name); 
            this.router.navigate(['/home']);
          } else {
            this.errorMessage = 'Invalid credentials';
          }
        },
        (err) => console.log(err)
      );
    }
  }
}

