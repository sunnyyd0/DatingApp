import { inject, Injectable } from '@angular/core';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class BusyService {
  busyRequestCount = 0;
  sppinerService = inject(NgxSpinnerService);
  busy() {
    this.busyRequestCount++;
    this.sppinerService.show(undefined, {
      type: 'line-scale',
      bdColor: 'rgba(255,255,255,0)',
      color: '#33333',
    });
  }
  idle() {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.sppinerService.hide();
      this.busyRequestCount = 0;
    }
  }
}
