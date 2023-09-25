import { User } from '@core/models';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/* if input value is not among options, input is invalid */
export function validateOptionExists(options: User[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const enteredValue = control.value;
    const optionExists = !enteredValue || options.some((option) => option.id === enteredValue?.id);
    return optionExists ? null : { optionDoesNotExist: true };
  };
}

/* Task state must not be 'in progress' or 'done' if user is not assigned */
export function validateState(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const stateControl = control.get('state');
    const assignedUserControl = control.get('assignedUser');

    if (stateControl && assignedUserControl) {
      const state = stateControl.value;
      const assignedUser = assignedUserControl.value;

      if (!assignedUser && (state?.toLowerCase() === 'in progress' || state?.toLowerCase() === 'done')) {
        return { invalidState: true };
      }
    }

    return null;
  };
}
