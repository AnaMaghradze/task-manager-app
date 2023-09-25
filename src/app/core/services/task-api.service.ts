import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Task } from '../models';
import { generateUUID } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class TaskApiService {
  private tasks: Task[] = TASKS;

  getAllTasks(): Observable<Task[]> {
    return of(this.tasks).pipe(delay(500));
  }

  createTask(task: Task): Observable<Task | null> {
    if (!task) return of(null);
    this.tasks.push(task);
    return of(task);
  }

  duplicateTask(taskToDuplicate: Task): Observable<Task | null> {
    if (!taskToDuplicate) return of(null);
    const duplicatedTask: Task = {
      ...taskToDuplicate,
      id: generateUUID(),
      state: 'in queue',
      assignedUser: null, /* remove assigned user as the same user cannot be assigned to more than one task */
      dateCreated: new Date(),
      dateModified: new Date(),
    };
    const index = this.tasks.findIndex((task) => task.id === taskToDuplicate.id) + 1;
    this.tasks.splice(index, 0, duplicatedTask);
    return of(duplicatedTask);
  }

  editTask(taskId: string, task: Task): Observable<Task | null> {
    const existingTaskIndex = this.tasks.findIndex((task: Task) => task.id === taskId);
    if (existingTaskIndex === -1) return of(null);
    this.tasks[existingTaskIndex] = { ...this.tasks[existingTaskIndex], ...task };
    return of(task);
  }

  deleteTask(taskId: string): Observable<string | null> {
    const existingTaskIndex = this.tasks.findIndex((task: Task) => task.id === taskId);
    if (existingTaskIndex === -1) return of(null);
    this.tasks?.splice(existingTaskIndex, 1);
    return of(taskId);
  }
}

const TASKS: Task[] = [
  {
    id: '1',
    name: 'task #1',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
    dateCreated: new Date('2020-12-12'),
    dateModified: new Date('2023-09-25'),
    state: 'in queue',
    priority: 'high',
    assignedUser: { name: 'Severus Snape', id: '5' },
  },
  {
    id: '2',
    name: 'task #2',
    description: 'description',
    dateCreated: new Date('2023-09-24'),
    dateModified: new Date('2023-09-25'),
    priority: 'none',
    state: 'in progress',
    assignedUser: { name: 'Hermione Granger', id: '2' },
  },
  {
    id: '3',
    name: 'task #3',
    description: 'description',
    dateCreated: new Date('2023-08-25'),
    dateModified: new Date('2023-09-25'),
    priority: 'medium',
    state: 'in queue',
    assignedUser: null,
  },
  {
    id: '4',
    name: 'task #4',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad cum excepturi fuga harum hic natus neque nobis quidem quos repellendus.',
    dateCreated: new Date('2022-12-12'),
    dateModified: new Date('2023-09-25'),
    priority: 'low',
    state: 'done',
    assignedUser: { name: 'Harry Potter', id: '1' },
  }
];
