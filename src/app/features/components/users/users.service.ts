import { Injectable } from '@angular/core';
import { Task, User } from '@core/models';
import { map, Observable, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { UserDialogComponent } from './user-dialog';
import { TaskApiService, UserApiService } from '@core/services';
import { Dialog } from '@angular/cdk/dialog';
import { AutoDestroy } from '@core/utils';
import { UserTaskAssignmentFilterType } from './users.component';

@Injectable()
export class UsersService {
  @AutoDestroy destroy: Subject<void> = new Subject<void>();

  tasks: Task[] = [];
  users: User[] = [];
  usersAndTasksMap: { [key: string]: Task | null } = {};

  constructor(
    private userApiService: UserApiService,
    private taskApiService: TaskApiService,
    private dialog: Dialog,
  ) {}

  getAllUsers(): Observable<User[]> {
    return this.userApiService.getAllUsers().pipe(
      takeUntil(this.destroy),
      tap((users: User[]) => {
        this.usersAndTasksMap = this.getUsersAndTasksMap(this.tasks, users);
        this.users = users;
      }),
    );
  }

  getFilteredUsersByTaskAssignment(filter: UserTaskAssignmentFilterType): Observable<User[]> {
    return this.userApiService.getAllUsers().pipe(
      takeUntil(this.destroy),
      map((users: User[]) => {
        this.usersAndTasksMap = this.getUsersAndTasksMap(this.tasks, users);
        let filteredUsers: User[] = [];
        switch (filter) {
          case 'withTask':
            filteredUsers = users?.filter((user) => this.usersAndTasksMap[user.id] !== null);
            break;
          case 'withoutTask':
            filteredUsers = users?.filter((user) => this.usersAndTasksMap[user.id] === null);
            break;
          case 'all':
            filteredUsers = users;
            break;
        }
        this.users = filteredUsers;
        return filteredUsers;
      }),
    );
  }

  editUser(user: User): Observable<User[]> {
    return this.userApiService.getAllUsers().pipe(
      tap((users: User[]) => {
        this.dialog.open(UserDialogComponent, {
          minWidth: '300px',
          maxWidth: '600px',
          data: {
            title: 'Edit User',
            mode: 'edit',
            users: users,
            user: user,
            save: (modifiedUser: User) => {
              this.saveUser(user.id, modifiedUser).subscribe();
            },
          },
        });
      }),
    );
  }

  createUser(): Observable<any> {
    return this.userApiService.getAllUsers().pipe(
      takeUntil(this.destroy),
      tap((users: User[]) => {
        this.dialog.open(UserDialogComponent, {
          minWidth: '300px',
          maxWidth: '600px',
          data: {
            mode: 'create',
            users: users,
            save: (user: User) => {
              this.userApiService.createUser(user).pipe(takeUntil(this.destroy)).subscribe();
            },
          },
        });
      }),
    );
  }

  deleteUser(userId: string): Observable<any> {
    return this.userApiService.deleteUser(userId).pipe(
      takeUntil(this.destroy),
      switchMap(() => {
        const task = this.usersAndTasksMap[userId];
        return task?.id
          ? this.taskApiService.editTask(task.id, {
              ...task,
              assignedUser: null,
              state: 'in queue',
            })
          : of();
      }),
    );
  }

  saveUser(userId: string, modifiedUser: User): Observable<any> {
    return this.userApiService.editUser(userId, modifiedUser).pipe(
      takeUntil(this.destroy),
      switchMap(() => {
        const task = this.usersAndTasksMap[userId];
        return task?.id
          ? this.taskApiService.editTask(userId, {
              ...task,
              assignedUser: modifiedUser,
            })
          : of();
      }),
    );
  }

  getUsersAndTasksMap(tasks: Task[], users: User[]): { [key: string]: Task | null } {
    const userTaskMap: { [key: string]: Task | null } = {};
    users?.forEach((user) => (userTaskMap[user.id] = null));
    tasks?.forEach((task) => {
      if (task.assignedUser) {
        userTaskMap[task.assignedUser?.id] = task;
      }
    });
    return userTaskMap;
  }
}
