import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private users: User[] = USERS;

  getAllUsers(): Observable<User[]> {
    return of(this.users).pipe(delay(500));
  }

  createUser(user: User): Observable<User | null> {
    if (!user) return of(null);
    this.users.push(user);
    return of(user);
  }

  editUser(userId: string, user: User): Observable<User | null> {
    const existingUserIndex = this.users.findIndex((user: User) => user.id === userId);
    if (existingUserIndex === -1) return of(null);
    this.users[existingUserIndex] = { ...this.users[existingUserIndex], ...user };
    return of(user);
  }

  deleteUser(userId: string): Observable<string | null> {
    const existingUserIndex = this.users.findIndex((task: User) => task.id === userId);
    if (existingUserIndex === -1) return of(null);
    this.users?.splice(existingUserIndex, 1);
    return of(userId);
  }
}

const USERS: User[] = [
  { name: 'Harry Potter', id: '1' },
  { name: 'Hermione Granger', id: '2' },
  { name: 'Ron Weasley', id: '3' },
  { name: 'Albus Dumbledore', id: '4' },
  { name: 'Severus Snape', id: '5' },
  { name: 'Tom Riddle', id: '6' },
  { name: 'Rubeus Hagrid', id: '7' },
  { name: 'Sirius Black', id: '8' },
  { name: 'Draco Malfoy', id: '9' },
  { name: 'Neville Longbottom', id: '10' },
];
