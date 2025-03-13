import { Component } from '@angular/core';
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list'; 
import { UserService } from '../services/user.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-homepage',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    RouterModule
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {
  sidenavIsExpanded: boolean = true;

  constructor(private userService: UserService, private router: Router){

  }

  logout(){
    this.userService.logout().subscribe({
      next: (response) => {
        console.log(response);
        this.router.navigateByUrl("/login");
      },
      error: (error) => {
        console.log(error)
        this.router.navigateByUrl("/login");
      }
    });
    
  }
}
