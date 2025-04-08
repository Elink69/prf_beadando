import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CourseDetailsDto } from '../../dtos/courseDetailsDto';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips'
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-course-details',
    imports: [
        MatDialogModule,
        MatButtonModule,
        MatCardModule,
        MatChipsModule,
        CommonModule
    ],
    templateUrl: './course-details.component.html',
    styleUrl: './course-details.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseDetailsComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: CourseDetailsDto){ 
  }
}
