import { Component, inject, OnInit } from '@angular/core';
import { MemberService } from '../../_services/member.service';
import { Member } from '../../_models/member';
import { MemeberDetailComponent } from '../memeber-detail/memeber-detail.component';
import { MemberCardComponent } from '../member-card/member-card.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { UserParams } from '../../_models/userPramas';
import { AcountService } from '../../_services/acount.service';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@Component({
  selector: 'app-memeber-list',
  standalone: true,
  imports: [MemberCardComponent, PaginationModule, FormsModule, ButtonsModule],
  templateUrl: './memeber-list.component.html',
  styleUrl: './memeber-list.component.css',
})
export class MemeberListComponent implements OnInit {
  memberService = inject(MemberService);
  accountService = inject(AcountService);
  userParams = new UserParams(this.accountService.currentuser());

  genderList = [
    { value: 'male', display: 'Males' },
    { value: 'female', display: 'Females' },
  ];
  ngOnInit(): void {
    let flg = this.memberService.paginatedResult();
    this.userParams = { ...this.memberService.userParams() };
    this.loadMembers();
    // if (!this.memberService.paginatedResult()) {
    //   this.userParams = { ...this.memberService.userParams() };
    //   this.loadMembers();
    // }
  }
  loadMembers() {
    this.memberService.getMembers(this.userParams);

    this.memberService.userParams.set(this.userParams);
  }
  pageChanged(event: any) {
    if (this.userParams.pageNumber != event.page) {
      this.userParams.pageNumber = event.page;
      this.loadMembers();
    }
  }
}
