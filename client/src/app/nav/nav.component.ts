import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AcountService } from '../_services/acount.service';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule, BsDropdownModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  accountService = inject(AcountService);
  model: any = {};

  login() {
    this.accountService.login(this.model).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => console.log(error),
    });
    console.log(this.model);
  }
  logout() {
    this.accountService.logout();
  }
}
