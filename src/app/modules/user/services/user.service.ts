import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface User {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUrl = 'http://localhost:3001/users';

  constructor(private http: HttpClient) {}

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.usersUrl}/${userId}`);
  }
}
