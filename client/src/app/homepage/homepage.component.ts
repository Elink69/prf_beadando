import { Component } from '@angular/core';
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { CourseDetailsDto } from '../dtos/courseDetailsDto';
import { CourseService } from '../services/course.service';
import { MatTableModule, MatTableDataSource, MatTable } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-homepage',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatTableModule,
    MatCardModule,
    RouterModule
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {
  pickedClasses = new MatTableDataSource<CourseDetailsDto>();
  displayedColumns: string[] = ['courseId', 'name', 'description', 'studentLimit', 'actions'];

  constructor(private courseService: CourseService){
    this.courseService.getPickedCourses().subscribe({
      next: (courses) => {
        console.log(courses);
        this.pickedClasses.data = courses
      },
      error: (err) => console.log(err)
    });
  }

  dropCourse(courseId: string) {
    console.log(`Dropping course: ${courseId}`);
  }
  
  viewDetails(course: CourseDetailsDto) {
    console.log('Viewing details for:', course);
  }
}
