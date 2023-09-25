import { User } from './user.model';

export interface Task {
  id: string;
  name: string;
  description: string;
  dateCreated: Date;
  dateModified: Date;
  state: TaskState;
  assignedUser: User | null;
  priority: TaskPriority;
}

export type TaskState = 'in queue' | 'in progress' | 'done';
export type TaskPriority = 'high' | 'medium' | 'low' | 'none';
