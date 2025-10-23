import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CourseDetailsDto } from '../dtos/courseDetailsDto';
import { UserService } from './user.service';
import { UserRoles } from '../enums/userRoles';
import { Router } from '@angular/router';
import { CourseCreationDto } from '../dtos/courseCreationDto';
import { CourseModifyDto } from '../dtos/courseModifyDto';
import { switchMap } from 'rxjs'
import { Classroom } from '../dtos/classroom';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private backendBase: string = environment.BACKEND_BASE;
  private url: string = `${this.backendBase}/courses`
  private pickClassUrl: string = `${this.backendBase}/pickCourse`
  constructor(
    private httpClient: HttpClient,
    private userService: UserService,
    private router: Router
  ) { }

  getClassrooms(){
    return this.httpClient.get<Classroom[]>(`${this.url}/classrooms`, {withCredentials: true})
  }

  getCourses() {
    return this.userService.getUserRole().pipe(switchMap((role) => {
      if(role.role === UserRoles.Admin) {
        return this.httpClient.get<CourseDetailsDto[]>(`${this.url}/`, {withCredentials: true});
      } else{
        return this.httpClient.get<CourseDetailsDto[]>(`${this.url}/active`, {withCredentials: true});
      }
    }));
    
  }

  getPickedCourses() {
    return this.httpClient.get<CourseDetailsDto[]>(`${this.url}/picked`, {withCredentials: true});
  }

  getCourseById(courseId: string){
    return this.httpClient.get<CourseDetailsDto>(`${this.url}/${courseId}`, {withCredentials: true});
  }

  createCourse(courseData: CourseCreationDto){
    return this.httpClient.post(`${this.url}/`, courseData, {withCredentials: true, responseType: "json"});
  }

  updateCourse(courseId: string, courseData: CourseModifyDto){
    return this.httpClient.put(`${this.url}/${courseId}`, courseData, {withCredentials: true, responseType: "json"});
  }

  deleteCourse(courseId: string){
    return this.httpClient.delete(`${this.url}/${courseId}`, {withCredentials: true, responseType: "json"});
  }

  pickCourse(courseId: string){
    return this.httpClient.post(`${this.pickClassUrl}/${courseId}`, 
      {},
      {
        withCredentials: true
      }
    )
  }

  dropCourse(courseId: string){
    return this.httpClient.delete(`${this.pickClassUrl}/${courseId}`, 
      {
        withCredentials: true
      },
    )
  }
}
