import { Component, inject, input, OnInit } from '@angular/core';
import { Member } from '../../_models/member';
import { MemberService } from '../../_services/member.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryModule, GalleryItem, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-memeber-detail',
  standalone: true,
  imports: [TabsModule, GalleryModule, TimeagoModule, DatePipe],
  templateUrl: './memeber-detail.component.html',
  styleUrl: './memeber-detail.component.css',
})
export class MemeberDetailComponent implements OnInit {
  memberService = inject(MemberService);
  route = inject(ActivatedRoute);
  http = inject(HttpClient);
  member?: Member;
  images: GalleryItem[] = [];

  ngOnInit() {
    this.loadMember();
  }
  loadMember() {
    const username = this.route.snapshot.paramMap.get('username');
    if (!username) return;

    this.memberService.getMember(username).subscribe({
      next: (member) => {
        this.member = member.result ? member.result : member;

        this.member?.photos?.map((photo) => {
          this.images.push(new ImageItem({ src: photo.url, thumb: photo.url }));
        });
      },
    });
  }
}
