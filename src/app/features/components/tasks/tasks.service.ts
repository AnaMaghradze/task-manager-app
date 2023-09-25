import { Injectable } from '@angular/core';
import { Task, TaskPriority, TaskState, User } from '@core/models';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { TaskDialogComponent } from './task-dialog';
import { TaskApiService, UserApiService } from '@core/services';
import { AutoDestroy } from '@core/utils';
import { Dialog } from '@angular/cdk/dialog';

@Injectable()
export class TasksService {
  @AutoDestroy destroy: Subject<void> = new Subject<void>();

  tasks: Task[] = [];

  dateCreatedSortAscending: boolean = true;
  dateModifiedSortAscending: boolean = true;

  constructor(
    private taskApiService: TaskApiService,
    private userApiService: UserApiService,
    private dialog: Dialog,
  ) {}

  getTasks(): Observable<Task[]> {
    return this.taskApiService.getAllTasks().pipe(
      takeUntil(this.destroy),
      tap((tasks) => (this.tasks = tasks)),
    );
  }

  createTask(): Observable<any> {
    return this.userApiService.getAllUsers().pipe(
      takeUntil(this.destroy),
      tap((users: User[]) => {
        const availableUsers = this.getUsersWithoutTask(users, this.tasks);
        this.dialog.open(TaskDialogComponent, {
          minWidth: '300px',
          data: {
            mode: 'create',
            users: availableUsers,
            save: (task: Task) => {
              this.taskApiService.createTask(task).pipe(takeUntil(this.destroy)).subscribe();
            },
          },
        });
      }),
    );
  }

  editTask(task: Task): Observable<any> {
    return this.userApiService.getAllUsers().pipe(
      takeUntil(this.destroy),
      tap((users: User[]) => {
        const availableUsers = this.getUsersWithoutTask(users, this.tasks, task);
        this.dialog.open(TaskDialogComponent, {
          minWidth: '300px',
          data: {
            mode: 'edit',
            task: task,
            users: availableUsers,
            save: (modifiedTask: Task) => {
              this.taskApiService.editTask(task.id, modifiedTask).pipe(takeUntil(this.destroy)).subscribe();
            },
          },
        });
      }),
    );
  }

  duplicateTask(task: Task): Observable<any> {
    return this.taskApiService.duplicateTask(task).pipe(takeUntil(this.destroy));
  }

  deleteTask(task: Task): Observable<any> {
    return this.taskApiService.deleteTask(task.id).pipe(takeUntil(this.destroy));
  }

  getFilteredTasks(priorityFilter: TaskPriority | 'all', stateFilter: TaskState | 'all'): Observable<Task[]> {
    return this.taskApiService.getAllTasks().pipe(
      takeUntil(this.destroy),
      map((tasks: Task[]) => {
        return tasks?.filter(
          (task) =>
            (priorityFilter === 'all' || task.priority?.toLowerCase() === priorityFilter?.toLowerCase()) &&
            (stateFilter === 'all' || task.state?.toLowerCase() === stateFilter?.toLowerCase()),
        );
      }),
    );
  }

  getSortedTasks(byValue: 'dateModified' | 'dateCreated'): Observable<Task[]> {
    return this.taskApiService.getAllTasks().pipe(
      takeUntil(this.destroy),
      map((tasks: Task[]) => {
        let sortedTasks = [];
        switch (byValue) {
          case 'dateCreated':
            sortedTasks = tasks?.sort((a, b) =>
              this.dateCreatedSortAscending
                ? a[byValue].getTime() - b[byValue].getTime()
                : b[byValue].getTime() - a[byValue].getTime(),
            );
            this.dateCreatedSortAscending = !this.dateCreatedSortAscending;
            break;
          case 'dateModified':
            sortedTasks = tasks?.sort((a, b) =>
              this.dateModifiedSortAscending
                ? a[byValue].getTime() - b[byValue].getTime()
                : b[byValue].getTime() - a[byValue].getTime(),
            );
            this.dateModifiedSortAscending = !this.dateModifiedSortAscending;
            break;
        }
        return sortedTasks;
      }),
    );
  }

  private getUsersWithoutTask(users: User[], tasks: Task[], currentTask?: Task): User[] {
    return (
      users?.filter(
        (user) => !tasks.some((task) => task.assignedUser?.id === user.id && currentTask?.assignedUser?.id !== user.id),
      ) ?? []
    );
  }
}
