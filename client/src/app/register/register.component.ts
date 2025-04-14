import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AcountService } from '../_services/acount.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  accountService = inject(AcountService);
  cancelRegister = output<boolean>();
  model: any = {};
  register() {
    this.accountService.register(this.model).subscribe({
      next: (response) => {
        console.log(response);
        this.cancel();
      },
      error: (error) => console.log(error),
    });
  }
  cancel() {
    this.cancelRegister.emit(false);
  }
}
