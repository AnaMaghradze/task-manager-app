import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, of, startWith } from 'rxjs';
import { MatChipsModule } from '@angular/material/chips';
import { validateOptionExists, validateState } from './tasks.validator';
import { User, Task } from '@core/models';
import { PageLayoutComponent } from '@shared/components';
import { generateUUID } from '@core/utils';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'tm-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss'],
})
export class TaskDialogComponent implements OnInit {
  taskForm!: FormGroup;
  filteredUsers$: Observable<User[]> = new Observable<User[]>();
  users: User[] = [];

  get dialogTitle(): string {
    return this.data.mode === 'edit' ? 'Edit Task' : 'Create Task';
  }

  get name(): FormControl {
    return this.taskForm.get('name') as FormControl;
  }

  get isValidUserAssigned(): boolean {
    return this.taskForm.controls['assignedUser'].value && this.taskForm.controls['assignedUser'].valid;
  }

  constructor(
    @Inject(DIALOG_DATA) private data: TaskDialogData,
    private dialogRef: DialogRef,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.users = this.data.users;
    this.createForm();

    this.filteredUsers$ =
      this.taskForm.get('assignedUser')?.valueChanges.pipe(
        startWith(''),
        map((value) => {
          const updatedValue = value?.name ?? value;
          return this._filter(updatedValue);
        }),
      ) ?? of([]);
  }

  createForm(): void {
    const formData = this.data?.task;
    this.taskForm = this.formBuilder.group(
      {
        id: [formData?.id ?? ''],
        name: [formData?.name ?? '', [Validators.required]],
        description: [formData?.description ?? ''],
        dateCreated: [formData?.dateCreated ?? ''],
        dateModified: [formData?.dateModified ?? ''],
        state: [formData?.state ?? 'in queue'],
        priority: [formData?.priority ?? 'none'],
        assignedUser: [formData?.assignedUser ?? null, [validateOptionExists(this.users)]],
      },
      { validators: [validateState()] },
    );
  }

  private _filter(value: string): User[] {
    const filterValue = value?.toLowerCase() || '';
    return this.users.filter((option) => option.name.toLowerCase().includes(filterValue));
  }

  saveTask(): void {
    if (this.taskForm.invalid) return;
    const formData = this.taskForm.value;
    const taskToSave: Task = {
      id: this.data.mode === 'create' ? generateUUID() : formData.id,
      name: formData.name,
      state: formData?.state,
      description: formData.description,
      assignedUser: formData.assignedUser,
      priority: formData.priority,
      dateCreated: this.data.mode === 'create' ? new Date() : formData.dateCreated,
      dateModified: new Date(),
    };
    this.data.save(taskToSave);
    this.closeDialog();
  }

  getUserName(selectedUser: User): string {
    return this.users?.find((user: User) => user.id === selectedUser?.id)?.name ?? '';
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}

export interface TaskDialogData {
  mode: 'create' | 'edit';
  users: User[];
  task?: Task;
  save: (task: Task) => Task;
}
