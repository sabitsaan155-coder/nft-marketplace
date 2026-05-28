import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private USERS_KEY   = 'nftm_users';
  private SESSION_KEY = 'nftm_session';

  getUsers(): User[] {
    const raw = localStorage.getItem(this.USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  getSession(): User | null {
    const raw = localStorage.getItem(this.SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  }


  login(username: string, password?: string): User | null {
    const user = this.getUsers().find(
      u => u.username === username && u.password === password
    );
    if (user) {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
    }
    return user || null;
  }

  register(user: User): { success: boolean; error?: string } {
    const users = this.getUsers();
    if (users.find(u => u.username === user.username)) {
      return { success: false, error: 'Пользователь с таким логином уже существует' };
    }
    users.push(user);
    this.saveUsers(users);
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
    return { success: true };
  }

  logout(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getSession();
  }
}