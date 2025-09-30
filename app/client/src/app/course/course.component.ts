import { Component, inject } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { CourseDetailsDto } from '../dtos/courseDetailsDto';
import { CourseService } from '../services/course.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CourseDetailsComponent } from '../modals/course-details/course-details.component';
import { UserRoles } from '../enums/userRoles';
import { CourseModifyDto } from '../dtos/courseModifyDto';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';
import { CourseCreationComponent } from '../modals/course-creation/course-creation.component';
import { UserDetailsDto } from '../dtos/userDetailsDto';
import { CourseEditComponent } from '../modals/course-edit/course-edit.component';

@Component({
  selector: 'app-course',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatTableModule,
    MatCardModule,
    MatDialogModule,
  ],
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss'
})
export class CourseComponent {
  readonly dialog = inject(MatDialog);
  userData!: UserDetailsDto
  role: UserRoles = UserRoles.Student;
  allClasses = new MatTableDataSource<CourseDetailsDto>();
  pickedClasses: string[] = []
  displayedColumns: string[] = ['courseId', 'name', 'description', 'studentLimit', 'actions'];

  constructor(
    private courseService: CourseService,
    private toastr: ToastrService,
    private userService: UserService
  ){
    this.refreshData();
  }
  
  refreshData(){
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.allClasses.data = courses
      },
      error: (err) => this.toastr.error("Couldn't retrieve course data", "Course Data")
    });
    this.courseService.getPickedCourses().subscribe({
      next: (courses) => {
        this.pickedClasses = [];
        courses.map((course) => {
          this.pickedClasses.push(course.courseId)
        });
      },
      error: (err) => this.toastr.error("Couldn't retrieve picked course data", "Picked Course Data")
    })
    this.userService.getUserRole().subscribe({
      next: (role) => {
        this.role = role.role
      },
      error: (_) => this.toastr.error("Couldn't retrieve user info", "User Info")
    })
    this.userService.getUserInfo().subscribe({
      next: data => this.userData = data,
      error: (_) => this.toastr.error("Couldn't retrieve user info", "User Info")
    })
  }

  pickCourse(courseId: string){
      this.courseService.pickCourse(courseId).subscribe({
        next: (_) => {
          this.toastr.success("Course sign-up successful", "Pick Course")
          this.refreshData()
        },
        error: (resp: {error: {error: string}}) => {
          if (resp.error.error === "Course is full"){
            this.toastr.error("The course is full", "Pick Course")
          }else {
            this.toastr.error("Error while picking course", "Pick Course")
          }
        }
      })
    
  }

  viewDetails(course: CourseDetailsDto) {
    const dialogRef = this.dialog.open(CourseDetailsComponent, {
      data: course,
      width: "50rem"
    });
  }

  rejectCourse(courseId: string) {
    this.courseService.deleteCourse(courseId).subscribe({
      next: (_) =>{
        this.toastr.success("Course rejection successful", "Reject Course")
        this.refreshData();
      },
      error: (err) => this.toastr.error("Error while rejecting course", "Reject Course")
    })
  }

  approveCourse(course: CourseDetailsDto) {
    const modifyData = new CourseModifyDto(
      course.name,
      course.description,
      course.schedule,
      course.studentLimit,
      course.teacherName,
      course.classRoom?.classRoomId!,
      true
    )
    this.courseService.updateCourse(course.courseId, modifyData).subscribe({
      next: _ =>  {
        this.toastr.success("Course approval successful", "Approve Course")
        this.refreshData()
      },
      error: (err) => this.toastr.error("Error while approving course", "Approve Course")
    })
  }

  dropCourse(courseId: string) {
    this.courseService.dropCourse(courseId).subscribe({
      next: _ => {
        this.toastr.warning("Course dropped", "Drop Course")
        this.refreshData()
      },
      error: (err) => this.toastr.error("Error while dropping course", "Drop Course")
    })
  }

  openCourseCreationDialog() {
    const dialogRef = this.dialog.open(CourseCreationComponent, {
      data: {userRole: this.role},
      width: "50rem"
    })
    dialogRef.afterClosed().subscribe(
      {
        next: _ => this.refreshData()
      }
    )
  }

  editCourse(courseData: CourseDetailsDto) {
    const dialogRef = this.dialog.open(CourseEditComponent, {
      data: courseData,
      width: "50rem"
    });
  }
}
