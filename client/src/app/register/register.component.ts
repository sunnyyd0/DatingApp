import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AcountService } from '../_services/acount.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private toastr = inject(ToastrService);
  accountService = inject(AcountService);
  cancelRegister = output<boolean>();
  model: any = {};
  register() {
    this.accountService.register(this.model).subscribe({
      next: (response) => {
        console.log(response);
        this.cancel();
      },
      error: (error) => this.toastr.error(error.error),
    });
  }
  cancel() {
    this.cancelRegister.emit(false);
  }
}
