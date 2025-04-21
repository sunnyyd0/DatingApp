import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { User } from '../_models/user';
import { map } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AcountService {
  http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  currentuser = signal<User | null>(null);

  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((user) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentuser.set(user);
        }
        return user;
      })
    );
  }
  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map((user) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentuser.set(user);
        }
        return user;
      })
    );
  }

  logout() {
    localStorage.removeItem('user');
    this.currentuser.set(null);
  }
}
