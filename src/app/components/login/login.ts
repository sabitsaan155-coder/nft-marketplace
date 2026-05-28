import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Нужно для обработки полей ввода
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
<div class="page" style="display: flex; justify-content: center; align-items: center; min-height: 70vh;">
  <div class="auth-card" style="background: var(--surface); border: 1px solid var(--border); padding: 40px; border-radius: 16px; max-width: 400px; width: 100%;">
    <h2 style="color: #fff; margin-bottom: 8px; text-align: center;">Войти в аккаунт</h2>
    <p style="color: rgba(255,255,255,0.5); text-align: center; margin-bottom: 24px; font-size: 14px;">Добро пожаловать обратно на NFTMarket</p>

    <div *ngIf="error" style="background: rgba(255, 74, 74, 0.1); border: 1px solid #ff4a4a; color: #ff4a4a; padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 14px;">
      {{ error }}
    </div>

    <form (ngSubmit)="onSubmit()">
      <div style="margin-bottom: 16px;">
        <label style="display: block; color: rgba(255,255,255,0.7); margin-bottom: 8px; font-size: 14px;">Имя пользователя</label>
        <input type="text" [(ngModel)]="username" name="username" required style="width: 100%; background: var(--surface2); border: 1px solid var(--border); padding: 12px; border-radius: 8px; color: #fff; font-family: inherit;">
      </div>

      <div style="margin-bottom: 24px;">
        <label style="display: block; color: rgba(255,255,255,0.7); margin-bottom: 8px; font-size: 14px;">Пароль</label>
        <input type="password" [(ngModel)]="password" name="password" required style="width: 100%; background: var(--surface2); border: 1px solid var(--border); padding: 12px; border-radius: 8px; color: #fff; font-family: inherit;">
      </div>

      <button type="submit" class="btn btn-primary" style="width: 100%; padding: 14px; margin-bottom: 16px;">Войти</button>
    </form>

    <p style="color: rgba(255,255,255,0.5); text-align: center; font-size: 14px; margin: 0;">
      Ещё нет аккаунта? <a routerLink="/register" style="color: var(--teal); text-decoration: none;">Зарегистрироваться</a>
    </p>
  </div>
</div>
  `
})
export class Login { // Название класса строго в твоем стиле
  username = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.username || !this.password) {
      this.error = 'Пожалуйста, заполните все поля';
      return;
    }
    
    const user = this.auth.login(this.username, this.password);
    if (user) {
      this.router.navigate(['/catalog']); // Перенаправляем в каталог при успехе
    } else {
      this.error = 'Неверное имя пользователя или пароль';
    }
  }
}