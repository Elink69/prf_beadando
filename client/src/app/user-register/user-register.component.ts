import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, Validators, ReactiveFormsModule, FormBuilder} from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button"; 
import { UserService } from '../services/user.service';
import { UserCreationDto } from '../dtos/userCreationDto';
import { UserRoles } from '../enums/userRoles';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-register',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './user-register.component.html',
  styleUrl: './user-register.component.scss'
})
export class UserRegisterComponent implements OnInit{
  registerForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
      confirmPassword: ["", [Validators.required]]
    }, {
      validator: this.mustMatch('password', 'confirmPassword')
    })
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && matchingControl.errors['mustWatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true});
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  submit() {
    if (this.registerForm.valid) {
      const userData = new UserCreationDto(
        this.registerForm.value["name"],
        this.registerForm.value["email"],
        this.registerForm.value["password"],
        UserRoles.Student
      )
      this.userService.register(userData).subscribe({
        next: () => {
          this.toastr.success("Succesfully registered user", "Registratrion");
          this.router.navigateByUrl("/login");
        },
        error: (err) => {
          this.toastr.error(err.error.error, "Registration");
        }
      })
    } else {
      this.toastr.warning("Please check the form for errors", "Form invalid");
    }
  }
}
