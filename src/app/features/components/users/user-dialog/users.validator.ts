import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { User } from '@core/models';

export function validateName(currentUser: User | undefined, users: User[] = []): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = (control.value as string).trim();

    // Check if the name has at least 3 characters
    if (value.length < 3) return { minLength: true };

    if (!/^[a-zA-Z]/.test(value)) return { startsWithLetter: true };

    // Check if the name is unique (not in the list of users)
    if (users.some((user) => user.name !== currentUser?.name && user.name.includes(value))) return { notUnique: true };

    return null;
  };
}
