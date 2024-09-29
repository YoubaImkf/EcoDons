import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private apiUrl = 'http://localhost:3001/items';

  constructor(private http: HttpClient) {}

  getItems(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getItemById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
