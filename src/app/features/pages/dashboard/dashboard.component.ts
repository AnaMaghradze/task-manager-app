import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NgClass, NgIf, NgOptimizedImage } from '@angular/common';
import { ClickOutsideDirective } from '@core/directives';

@Component({
  selector: 'tm-dashboard',
  standalone: true,
  imports: [RouterModule, RouterOutlet, MatIconModule, NgOptimizedImage, NgClass, NgIf, ClickOutsideDirective],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  isSidebarClosed = true;

  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }
}
