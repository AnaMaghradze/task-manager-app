import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent, TagComponent } from '@shared/components';
import { AutoDestroy, Task, TaskPriority, TaskState } from 'src/app/core';
import { CdkContextMenuTrigger, CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { Observable, Subject } from 'rxjs';
import { DialogModule } from '@angular/cdk/dialog';
import { TaskDialogComponent } from './task-dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { TasksService } from './tasks.service';

@Component({
  selector: 'tm-tasks',
  standalone: true,
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  imports: [
    CommonModule,
    PageLayoutComponent,
    CdkContextMenuTrigger,
    CdkMenu,
    CdkMenuItem,
    DialogModule,
    TaskDialogComponent,
    MatExpansionModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule,
    TagComponent,
    MatIconModule,
    MatSelectModule,
  ],
  providers: [TasksService],
})
export class TasksComponent implements OnInit {
  @AutoDestroy destroy: Subject<void> = new Subject<void>();

  pageStartIndex: number = 0;
  pageEndIndex: number = 5;

  tasks$: Observable<Task[]> = new Observable<Task[]>();
  selectedTask: Task | null = null;

  priorityFilter: TaskPriority | 'all' = 'all';
  stateFilter: TaskState | 'all' = 'all';

  get tasksLength(): number {
    return this.tasksService.tasks.length;
  }

  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {
    this.tasks$ = this.tasksService.getTasks();
  }

  selectTask(task: Task): void {
    if (this.selectedTask?.id === task?.id) this.selectedTask = null;
    else this.selectedTask = task;
  }

  createTask(): void {
    this.tasksService.createTask().pipe().subscribe();
  }

  editTask(task: Task | null): void {
    if (!task) return;
    this.tasksService.editTask(task).subscribe();
  }

  duplicateTask(task: Task): void {
    if (!task) return;
    this.tasksService.duplicateTask(task).subscribe();
  }

  deleteTask(task: Task | null): void {
    if (!task) return;
    this.tasksService.deleteTask(task).subscribe();
    this.selectedTask = null;
  }

  handleFilter(): void {
    this.tasks$ = this.tasksService.getFilteredTasks(this.priorityFilter, this.stateFilter);
  }

  sort(byValue: 'dateModified' | 'dateCreated'): void {
    this.tasks$ = this.tasksService.getSortedTasks(byValue);
  }

  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }

  onPaginatorPageChange(event: PageEvent): PageEvent {
    this.pageStartIndex = event.pageIndex * event.pageSize;
    this.pageEndIndex = this.pageStartIndex + event.pageSize;
    return event;
  }

  getStateTagColor(state: TaskState): string {
    return state?.toLowerCase() === 'in queue'
      ? 'bg-yellow'
      : state?.toLowerCase() === 'in progress'
      ? 'bg-blue'
      : 'bg-green';
  }
  getPriorityTagColor(priority: TaskPriority): string {
    return priority?.toLowerCase() === 'high'
      ? 'bg-red-outline'
      : priority?.toLowerCase() === 'medium'
      ? 'bg-purple-outline'
      : priority?.toLowerCase() === 'low'
      ? 'bg-yellow-outline'
      : 'bg-gray-outline';
  }
}
