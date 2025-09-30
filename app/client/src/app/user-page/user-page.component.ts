import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';
import { UserDetailsDto } from '../dtos/userDetailsDto';
import { UserRoles } from '../enums/userRoles';
import { UserEditComponent } from '../modals/user-edit/user-edit.component';
import { nextTick } from 'process';

@Component({
  selector: 'app-user-page',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatTableModule,
    MatCardModule,
    MatDialogModule
  ],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent {
  readonly dialog = inject(MatDialog);
  userDetails = new MatTableDataSource<UserDetailsDto>();
  displayedColumns: string[] = ['name', 'email', 'visibleRole', 'creationDate', 'actions'];

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
  ){
    this.refreshData();
  }
  
  refreshData(){
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        users.forEach((user) => {
          switch (user.role){
            case UserRoles.Admin:
              user.visibleRole = "Admin";
              break;
            case UserRoles.Student:
              user.visibleRole = "Student";
              break;
            case UserRoles.Teacher:
              user.visibleRole = "Teacher";
              break;
            default:
              break;
          }
        });
        this.userDetails.data = users
      },
      error: (err) => this.toastr.error("Couldn't retrieve user data", "User data")
    });
  }

  modifyUser(user: UserDetailsDto) {
    const dialogRef = this.dialog.open(UserEditComponent, {
        data: user,
        width: "50rem"
    });

    dialogRef.afterClosed().subscribe({
      next: _ => this.refreshData(),
      error: (err) => console.log(err)
    });
  }

  deleteUser(userEmail: any) {
    this.userService.deleteUser(userEmail).subscribe({
      next: _ => {
        this.refreshData();
        this.toastr.success("User deleted succesfully", "Delete User")
      },
      error: (err) => this.toastr.error("Couldn't delete user", "Delete User")
    })
  }
}
