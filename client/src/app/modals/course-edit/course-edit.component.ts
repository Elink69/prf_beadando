import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UserRoles } from '../../enums/userRoles';
import { UserService } from '../../services/user.service';
import { UserDetailsDto } from '../../dtos/userDetailsDto';
import { ToastrService } from 'ngx-toastr';
import { Classroom } from '../../dtos/classroom';
import { CourseService } from '../../services/course.service';
import { CourseCreationDto } from '../../dtos/courseCreationDto';
import { CourseDetailsDto } from '../../dtos/courseDetailsDto';
import { CourseModifyDto } from '../../dtos/courseModifyDto';

@Component({
  selector: 'app-course-edit',
  standalone: true,
  templateUrl: './course-edit.component.html',
  styleUrl: './course-edit.component.scss',
  providers: [ { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS }],
  imports: [
      MatDialogModule,
      MatButtonModule,
      MatCardModule,
      MatInputModule,
      MatChipsModule,
      CommonModule,
      MatFormFieldModule,
      ReactiveFormsModule,
      MatSelectModule,
      MatDatepickerModule,
      MatIconModule,
      MatSlideToggleModule,
      MatNativeDateModule,
    ],
})
export class CourseEditComponent {
  courseForm: FormGroup;

  userData!: UserDetailsDto

  weekdays = [
    { value: 1, view: 'Monday' },
    { value: 2, view: 'Tuesday' },
    { value: 3, view: 'Wednesday' },
    { value: 4, view: 'Thursday' },
    { value: 5, view: 'Friday' },
  ];

  // These should be passed in or fetched — you can adjust as needed
  teachers: UserDetailsDto[] = [];

  classrooms!: Classroom[];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseEditComponent>,
    private toastr: ToastrService,
    private userService: UserService,
    private courseService: CourseService,
    @Inject(MAT_DIALOG_DATA) public data: CourseDetailsDto
  ) {
    this.updateData()
    this.courseForm = this.fb.group({
      courseId: [data.courseId, Validators.required],
      name: [data.name, Validators.required],
      description: [data.description, [Validators.required]],
      teacherId: [data.teacherName, Validators.required],
      classRoomId: [data.classRoom?.classRoomId, [Validators.required]],
      studentLimit: [data.studentLimit, [Validators.required, Validators.min(1)]],
      dayOfWeek: [''],
      time: [''],
      dateRange: this.fb.group({
        startDate: [null],
        endDate: [null]
      })
    });
  }

  updateData(): void {
    this.userService.getUserInfo().subscribe(
      {
        next: data => {this.userData = data; console.log(this.userData)},
        error: _ => this.toastr.error("Couldn't retrieve user info", "User info")
      }
    )

    this.userService.getAllUsers().subscribe(
      {
        next: data => {
          data.forEach(user => {
            if (user.role === UserRoles.Teacher){
              this.teachers.push(user);
            }
          });
        }
      }
    )
   
    this.courseService.getClassrooms().subscribe(
      {
        next: data => this.classrooms = data,
        error: _ => this.toastr.error("Couldn't retrieve classroom info", "Classroom info")
      }
    )
  }

  submitCourse(): void {
    if(this.courseForm.valid){
      const { dayOfWeek, time, dateRange, ...data } = this.courseForm.value;
      const [hour, minute] = time.split(':').map(Number);
      const start = dateRange.startDate;
      const end = dateRange.endDate;

      const modifiedCourse: CourseModifyDto = {
        description: data["description"],
        name: data["name"],
        studentLimit: data["studentLimit"],
        teacherName: data["teacherId"],
        isActive: this.data.isActive,
        schedule: this.data.schedule,
        classroomId: data["classRoomId"]
      };

      if(dayOfWeek && time && dateRange){
        const occurrences: Date[] = [];
        let current = new Date(start);
        const delta = (dayOfWeek - current.getDay() + 7) % 7;
        current.setDate(current.getDate() + delta);
        current.setHours(hour, minute, 0, 0);
  
        while (current <= end) {
          occurrences.push(new Date(current));
          current.setDate(current.getDate() + 7);
        }
  
        modifiedCourse.schedule = occurrences;
      } 


      this.courseService.updateCourse(this.data.courseId, modifiedCourse).subscribe(
        {
          next: _ => this.toastr.success("Created new course", "Course creation"),
          error: _ => this.toastr.error("Couldn't create new course", "Course creation")
        }
      )

      this.dialogRef.close(modifiedCourse);
    }
  }
}
