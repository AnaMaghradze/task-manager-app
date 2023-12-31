import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkContextMenuTrigger, CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { PageLayoutComponent } from '@shared/components';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { TaskApiService, UserApiService } from '@core/services';
import { User, Task } from '@core/models';
import { AutoDestroy } from '@core/utils';
import { UsersService } from './users.service';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { UserDialogComponent } from './user-dialog';

@Component({
  selector: 'tm-users',
  standalone: true,
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  imports: [
    CommonModule,
    CdkMenu,
    CdkMenuItem,
    PageLayoutComponent,
    CdkContextMenuTrigger,
    DialogModule,
    MatPaginatorModule,
    FormsModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
  ],
  providers: [UsersService],
})
export class UsersComponent implements OnInit {
  @AutoDestroy destroy: Subject<void> = new Subject<void>();

  /* paginator variables */
  pageStartIndex: number = 0;
  pageEndIndex: number = 5;

  filter: 'withTask' | 'withoutTask' | 'all' = 'all';

  users$: Observable<User[]> = new Observable<User[]>();
  selectedUser: User | null = null;

  get usersAndTasksMap(): { [key: string]: Task | null } {
    return this.usersService.usersAndTasksMap;
  }
  get totalUsers(): number {
    return this.usersService.users?.length;
  }

  constructor(
    private taskApiService: TaskApiService,
    private userApiService: UserApiService,
    private usersService: UsersService,
    private dialog: Dialog,
  ) {}

  ngOnInit(): void {
    this.getUsers();
    this.taskApiService.getAllTasks().subscribe((value) => (this.usersService.tasks = value));
  }

  selectUser(user: User): void {
    if (this.selectedUser?.id === user?.id) this.selectedUser = null;
    else this.selectedUser = user;
  }

  getUsers(): void {
    this.users$ = this.usersService.getAllUsers();
  }

  createUser(): void {
    this.userApiService
      .getAllUsers()
      .pipe(
        takeUntil(this.destroy),
        tap((users: User[]) => {
          this.dialog.open(UserDialogComponent, {
            minWidth: '300px',
            maxWidth: '600px',
            data: {
              mode: 'create',
              users: users,
              save: (user: User) => {
                this.userApiService
                  .createUser(user)
                  .pipe(takeUntil(this.destroy))
                  .subscribe(() => this.getUsers());
              },
            },
          });
        }),
      )
      .subscribe();
  }

  editUser(user: User | null): void {
    if (!user) return;
    this.userApiService
      .getAllUsers()
      .pipe(
        takeUntil(this.destroy),
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
                this.selectedUser = null;
                this.usersService.saveUser(user.id, modifiedUser).subscribe(() => this.getUsers());
              },
            },
          });
        }),
      )
      .subscribe();
  }

  deleteUser(user: User | null): void {
    if (!user) return;
    this.selectedUser = null;
    this.usersService.deleteUser(user.id).subscribe(() => this.getUsers());
  }

  handleFilter(): void {
    this.users$ = this.usersService.getFilteredUsersByTaskAssignment(this.filter).pipe(takeUntil(this.destroy));
  }

  trackByUserId(index: number, user: User): string {
    return user.id;
  }

  onPaginatorPageChange(event: PageEvent): PageEvent {
    this.pageStartIndex = event.pageIndex * event.pageSize;
    this.pageEndIndex = this.pageStartIndex + event.pageSize;
    return event;
  }
}

export type UserTaskAssignmentFilterType = 'withTask' | 'withoutTask' | 'all';
