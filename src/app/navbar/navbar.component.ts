import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { KENDO_BUTTONS } from "@progress/kendo-angular-buttons";

import { CalendarModule } from '@progress/kendo-angular-dateinputs';



@Component({
  selector: 'app-navbar',
  imports: [CommonModule,KENDO_BUTTONS,CalendarModule],
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isCalendarOpen = false;
  selectedDate: Date = new Date();
 
  toggleCalendarDropdown() {
    this.isCalendarOpen = !this.isCalendarOpen;
  }
 
  




}
