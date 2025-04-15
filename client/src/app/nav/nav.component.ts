import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AcountService } from '../_services/acount.service';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Toast, ToastrService } from 'ngx-toastr';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    FormsModule,
    BsDropdownModule,
    RouterLink,
    RouterLinkActive,
    TitleCasePipe,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  private toastr = inject(ToastrService);
  private router = inject(Router);
  accountService = inject(AcountService);
  model: any = {};

  login() {
    this.accountService.login(this.model).subscribe({
      next: (_) => {
        console.log(this.accountService.currentuser());
        this.router.navigateByUrl('/members');
      },
      error: (error) => this.toastr.error(error.error),
    });
    console.log(this.model);
  }
  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
