import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { GridComponent } from './grid/grid.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,NavbarComponent,GridComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

}
