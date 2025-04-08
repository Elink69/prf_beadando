import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { CourseDetailsDto } from '../dtos/courseDetailsDto';
import { CourseService } from '../services/course.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule} from '@angular/material/dialog';
import { CourseDetailsComponent } from '../modals/course-details/course-details.component';
import { Toast, ToastrService } from 'ngx-toastr';

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
    RouterModule,
    MatDialogModule
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomepageComponent {
  readonly dialog = inject(MatDialog);

  pickedClasses = new MatTableDataSource<CourseDetailsDto>();
  displayedColumns: string[] = ['courseId', 'name', 'description', 'studentLimit', 'actions'];

  constructor(
    private courseService: CourseService,
    private toastr: ToastrService
  ){
    this.refreshData();
  }

  refreshData(){
    this.courseService.getPickedCourses().subscribe({
      next: (courses) => {
        this.pickedClasses.data = courses
      },
      error: (err) => console.log(err)
    });
  }

  viewDetails(course: CourseDetailsDto) {
    const dialogRef = this.dialog.open(CourseDetailsComponent, {
      data: course,
      width: "50rem"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
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
}
