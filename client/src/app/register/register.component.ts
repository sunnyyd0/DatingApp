import { Component, inject, OnInit, output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AcountService } from '../_services/acount.service';
import { ToastrService } from 'ngx-toastr';
import { JsonPipe } from '@angular/common';
import { TextInputComponent } from '../_forms/text-input/text-input.component';
import { DatePickerComponent } from '../_forms/date-picker/date-picker.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    JsonPipe,
    TextInputComponent,
    DatePickerComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  accountService = inject(AcountService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  cancelRegister = output<boolean>();
  model: any = {};
  registerFrom: FormGroup = new FormGroup({});
  maxDate = new Date();
  validationErrors: string[] | undefined;

  ngOnInit(): void {
    this.initializeFrom();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }
  initializeFrom() {
    this.registerFrom = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.maxLength(4)]],
      confirmPassword: [
        '',
        [Validators.required, this.matchValues('password')],
      ],
    });
    this.registerFrom.controls['password'].valueChanges.subscribe({
      next: () =>
        this.registerFrom.controls['confirmPassword'].updateValueAndValidity(),
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value
        ? null
        : { isMatching: true };
    };
  }
  register() {
    console.log(this.registerFrom.value);
    // this.accountService.register(this.model).subscribe({
    //   next: (response) => {
    //     console.log(response);
    //     this.cancel();
    //   },
    //   error: (error) => this.toastr.error(error.error),
    // });
    const dob = this.getDateOnly(this.registerFrom.get('dateOfBirth')?.value);
    this.registerFrom.patchValue({ dateOfBirth: dob });
    this.accountService.register(this.registerFrom.value).subscribe({
      next: (_) => this.router.navigateByUrl('/members'),
      error: (error) => (this.validationErrors = error),
    });
  }
  cancel() {
    this.cancelRegister.emit(false);
  }

  private getDateOnly(dob: string | undefined) {
    if (!dob) return;
    return new Date(dob).toISOString().slice(0, 10);
  }
}
