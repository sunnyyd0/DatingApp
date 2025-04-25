import { Component, inject, input, Input, output } from '@angular/core';
import { Member } from '../../_models/member';
import { FileUploadModule, FileUploader } from 'ng2-file-upload';
import { environment } from '../../../environments/environment';
import { AcountService } from '../../_services/acount.service';
import { DecimalPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { Photo } from '../../_models/photo';
import { MemberService } from '../../_services/member.service';

@Component({
  selector: 'app-photo-editor',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, NgStyle, DecimalPipe, FileUploadModule],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.css',
})
export class PhotoEditorComponent {
  member = input.required<Member>();
  uploader?: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  memberChange = output<Member>();
  accountService = inject(AcountService);
  memberService = inject(MemberService);
  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  deletePhoto(photo: Photo) {
    this.memberService.deletePhoto(photo).subscribe({
      next: (_) => {
        const updatedMember = { ...this.member() };
        updatedMember.photos = updatedMember.photos.filter(
          (x) => x.id !== photo.id
        );
        this.memberChange.emit(updatedMember);
      },
    });
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.accountService.currentuser()?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      const photo = JSON.parse(response);
      const updatedMember = { ...this.member() };
      updatedMember.photos.push(photo);
      this.memberChange.emit(updatedMember);
      if (photo.isMain) {
        const user = this.accountService.currentuser();
        if (user) {
          user.photoUrl = photo.url;
          this.accountService.currentuser.set(user);
        }
        updatedMember.photoUrl = photo.url;
        updatedMember.photos.forEach((p) => {
          if (p.isMain) p.isMain = false;
          if (p.id === photo.id) p.isMain = true;
        });
        this.memberChange.emit(updatedMember);
      }
    };
  }
  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhot(photo).subscribe({
      next: (_) => {
        const user = this.accountService.currentuser();
        if (user) {
          user.photoUrl = photo.url;
          this.accountService.currentuser.set(user);
        }
        const updatedMember = { ...this.member() };
        updatedMember.photoUrl = photo.url;
        updatedMember.photos.forEach((p) => {
          if (p.isMain) p.isMain = false;
          if (p.id === photo.id) p.isMain = true;
        });
        this.memberChange.emit(updatedMember);
      },
    });
  }
}
