import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
  loggedUser: any;

  constructor(private _router: Router) {
    if (typeof window !== 'undefined') {
      const localuser = localStorage.getItem('loggedUser');
      if (localuser != null) {
        this.loggedUser = JSON.parse(localuser);
      }
    }
  }

  onLogOut() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('loggedUser');
      this._router.navigateByUrl('/loginsignup');
    }
  }
}
