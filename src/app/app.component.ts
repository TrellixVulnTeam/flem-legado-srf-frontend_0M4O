import { Component} from '@angular/core';
import { UserDataService } from './service/user-data.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private data: UserDataService, private router: Router){

  }

  logout(){
    this.data.logout();
    this.router.navigate(['/login']);
  }

}
