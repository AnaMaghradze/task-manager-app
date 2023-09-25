import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './features/pages';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, DashboardComponent],
})
export class AppComponent {
  title = 'TASK MANAGER';
}
