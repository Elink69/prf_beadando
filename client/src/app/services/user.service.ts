import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDetailsDto } from '../dtos/userDetailsDto';
import { UserCreationDto } from '../dtos/userCreationDto';
import { UserRoles } from '../enums/userRoles';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = "http://localhost:12212/users";

  constructor(private httpClient: HttpClient) { }

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
    return this.httpClient.get<UserRoles>(`${this.url}/role`,
      {
        withCredentials: true
      }
    )
  }
}
