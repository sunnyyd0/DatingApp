import {
  Component,
  HostListener,
  inject,
  OnInit,
  ViewChild,
  viewChild,
} from '@angular/core';
import { AcountService } from '../../_services/acount.service';
import { MemberService } from '../../_services/member.service';
import { Member } from '../../_models/member';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { Form, FormsModule, NgForm } from '@angular/forms';
import { Toast, ToastrService } from 'ngx-toastr';
import { PhotoEditorComponent } from '../photo-editor/photo-editor.component';
import { DatePipe } from '@angular/common';
import { TimeagoModule } from 'ngx-timeago';
@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [
    TabsModule,
    FormsModule,
    PhotoEditorComponent,
    DatePipe,
    TimeagoModule,
  ],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css',
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm?: NgForm;
  member?: Member;
  accountService = inject(AcountService);
  memberService = inject(MemberService);
  toastr = inject(ToastrService);
  @HostListener('window:beforeunload', ['$event']) notify($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  ngOnInit(): void {
    this.loadMember();
  }
  loadMember() {
    let curUser = this.accountService.currentuser();
    if (curUser) {
      let username = curUser.username;
      this.memberService.getMember(username).subscribe({
        next: (response) => {
          this.member = response.result;
          console.log(this.member);
        },
      });
    }
  }
  uploadMember() {
    this.memberService.updateMember(this.editForm?.value).subscribe({
      next: (res) => {
        this.editForm?.reset(this.member);
        this.toastr.success('Member Uploaded successfully');
      },
    });
  }
  onMemberChange(event: Member) {
    this.member = event;
  }
}
