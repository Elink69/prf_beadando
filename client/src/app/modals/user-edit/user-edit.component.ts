import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { UserDetailsDto } from '../../dtos/userDetailsDto';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { UserRoles } from '../../enums/userRoles';
import { UserService } from '../../services/user.service';
import { UserModifyDto } from '../../dtos/userModifyDto';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-edit',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatChipsModule,
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss'
})
export class UserEditComponent implements OnInit{
  userService: UserService = inject(UserService)
  toastr: ToastrService = inject(ToastrService)
  editForm!: FormGroup;

  readableRoles = {
    [UserRoles.Admin]: "Admin",
    [UserRoles.Teacher]: "Teacher",
    [UserRoles.Student]: "Student"
  }

  roleOptions = [
    { value: UserRoles.Admin },
    { value: UserRoles.Teacher },
    { value: UserRoles.Student }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public userData: UserDetailsDto,
    private formBuilder: FormBuilder,
  ){
  }

  ngOnInit() {
    this.editForm = this.formBuilder.group({
      name: [this.userData.name, [Validators.required]],
      email: [this.userData.email, [Validators.required, Validators.email]],
      role: [this.userData.role, [Validators.required]],
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

  submit(){
    if (this.editForm.valid){
      const userEdit = new UserModifyDto(
        this.editForm.value["name"],
        this.editForm.value["email"],
        this.editForm.value["role"],
        this.editForm.value["password"]
      )
      this.userService.modifyUser(this.userData.email, userEdit).subscribe({
        next: _ => this.toastr.success("User modified sucessfully", "Modify user"),
        error: (err) => this.toastr.error("Couldn't modify user", "Modify User")
      });
    }
  }

}
