import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_models/member';
import { AcountService } from './acount.service';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  baseUrl = environment.apiUrl;
  http = inject(HttpClient);
  accountService = inject(AcountService);
  getMembers() {
    return this.http.get<Member[]>(this.baseUrl + 'users');
  }
  getMember(username: string) {
    return this.http.get<any>(this.baseUrl + 'users/' + username);
  }

  // getHttpOptions() {
  //   return {
  //     headers: new HttpHeaders({
  //       Authorization: `Bearer ${this.accountService.currentuser()?.token}`,
  //     }),
  //   };
  // }
}
