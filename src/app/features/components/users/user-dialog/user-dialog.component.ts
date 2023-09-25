import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { PageLayoutComponent } from '@shared/components';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { generateUUID, User } from '../../../../core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { validateName } from './users.validator';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'tm-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatInputModule,
    MatOptionModule,
    PageLayoutComponent,
    ReactiveFormsModule,
    MatIconModule,
  ],
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss'],
})
export class UserDialogComponent implements OnInit {
  userForm!: FormGroup;

  get dialogTitle(): string {
    return this.data.mode === 'edit' ? 'Edit User' : 'Create User';
  }

  get name(): FormControl {
    return this.userForm.get('name') as FormControl;
  }

  constructor(
    @Inject(DIALOG_DATA) private data: UserDialogData,
    private dialogRef: DialogRef,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    const formData = this.data?.user;
    this.userForm = this.formBuilder.group({
      id: [formData?.id ?? generateUUID()],
      name: [formData?.name ?? '', [Validators.required, validateName(this.data.user, this.data.users)]],
    });
  }

  saveUser(): void {
    if (this.userForm?.invalid) return;
    const formData = this.userForm.value;
    const userToSave: User = {
      id: formData.id,
      name: formData.name.trim(),
    };
    this.data.save(userToSave);
    this.closeDialog();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}

export interface UserDialogData {
  mode: 'create' | 'edit';
  users: User[];
  user?: User;
  save: (user: User) => User;
}
