import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_models/member';
import { AcountService } from './acount.service';
import { of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  baseUrl = environment.apiUrl;
  http = inject(HttpClient);
  accountService = inject(AcountService);
  members = signal<Member[]>([]);
  getMembers() {
    return this.http.get<Member[]>(this.baseUrl + 'users').subscribe({
      next: (members) => this.members.set(members),
    });
  }
  getMember(username: string) {
    const member = this.members().find((x) => x.username === username);
    if (member !== undefined) return of(member);
    return this.http.get<any>(this.baseUrl + 'users/' + username);
  }
  updateMember(memeber: Member) {
    return this.http.put(this.baseUrl + 'users', memeber).pipe(
      tap(() => {
        this.members.update((members) =>
          members.map((m) => (m.username === memeber.username ? memeber : m))
        );
      })
    );
  }

  // getHttpOptions() {
  //   return {
  //     headers: new HttpHeaders({
  //       Authorization: `Bearer ${this.accountService.currentuser()?.token}`,
  //     }),
  //   };
  // }
}
