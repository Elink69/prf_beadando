import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDetailsDto } from '../dtos/userDetailsDto';
import { UserCreationDto } from '../dtos/userCreationDto';
import { UserRoles } from '../enums/userRoles';
import { UserModifyDto } from '../dtos/userModifyDto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private backendBase = environment.BACKEND_BASE;
  private url = `${this.backendBase}/users`;

  constructor(private httpClient: HttpClient) { }

  deleteUser(userEmail: string){
    return this.httpClient.delete(`${this.url}/${userEmail}`, 
      {
        responseType: "json",
        withCredentials: true
      }
    );
  }

  getAllUsers(){
    return this.httpClient.get<UserDetailsDto[]>(`${this.url}/`,
      {
        withCredentials: true
      }
    )
  }

  modifyUser(userEmail: string, editDto: UserModifyDto){
    return this.httpClient.put(`${this.url}/${userEmail}`, editDto, 
      { 
        responseType: "json",
        withCredentials: true
      }
    )
  }

  getUserInfo(){
    return this.httpClient.get<UserDetailsDto>(`${this.url}/userInfo`,
      {
        withCredentials: true
      }
    );
  }

  login(email: string, password: string){
    return this.httpClient.post<UserDetailsDto>(`${this.url}/login`,
      {
        username: email,
        password: password
      },
      {
        responseType: "json",
        withCredentials: true
      }
    );
  }

  register(userDetails: UserCreationDto){
    return this.httpClient.post(`${this.url}/register`,
      userDetails,
      {
        responseType: "json",
        withCredentials: true
      }
    );
  }

  logout(){
    return this.httpClient.post(`${this.url}/logout`,
      {},
      {
        responseType: "json",
        withCredentials: true
      }
    );
  }

  checkauth(){
    return this.httpClient.get<boolean>(`${this.url}/checkAuth`,
      {
        withCredentials: true
      }
    );
  }

  getUserRole(){
    return this.httpClient.get<{role: UserRoles}>(`${this.url}/role`,
      {
        responseType: "json",
        withCredentials: true
      }
    )
  }
}
