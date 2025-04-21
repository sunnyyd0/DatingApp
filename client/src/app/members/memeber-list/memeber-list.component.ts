import { Component, inject, OnInit } from '@angular/core';
import { MemberService } from '../../_services/member.service';
import { Member } from '../../_models/member';
import { MemeberDetailComponent } from '../memeber-detail/memeber-detail.component';
import { MemberCardComponent } from '../member-card/member-card.component';

@Component({
  selector: 'app-memeber-list',
  standalone: true,
  imports: [MemberCardComponent],
  templateUrl: './memeber-list.component.html',
  styleUrl: './memeber-list.component.css',
})
export class MemeberListComponent implements OnInit {
  memberService = inject(MemberService);

  ngOnInit(): void {
    if (this.memberService.members().length == 0) {
      this.loadMembers();
    }
  }
  loadMembers() {
    this.memberService.getMembers();
  }
}
