import { NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { AcountService } from './_services/acount.service';
import { HomeComponent } from './home/home.component';
import { NgxSpinnerModule } from 'ngx-spinner';

// import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgFor, NavComponent, HomeComponent, NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'Dating app';
  accountService = inject(AcountService);
  ngOnInit(): void {
    this.setUser();
  }

  setUser() {
    const userStirng = localStorage.getItem('user');
    if (!userStirng) return;
    const user = JSON.parse(userStirng);
    this.accountService.setCurrentUser(user);
  }
}
