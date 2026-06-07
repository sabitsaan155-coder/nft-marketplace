import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="max-width: 600px;">
      <h1 class="detail-title" style="margin-bottom: 40px;">Create Profile</h1>

      <div style="display: flex; align-items: center; gap: 24px; margin-bottom: 40px;">
        <div 
          (click)="fileInput.click()"
          style="width: 120px; height: 120px; border-radius: 50%; background: #131a22; border: 2px dashed var(--primary); display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; overflow: hidden; position: relative; transition: all 0.2s;"
        >
          <img *ngIf="user?.avatar" [src]="user?.avatar" style="width: 100%; height: 100%; object-fit: cover;">
          
          <div *ngIf="!user?.avatar" style="display: flex; flex-direction: column; align-items: center;">
            <span style="font-size: 24px;">📸</span>
            <span style="color: var(--primary); font-size: 11px; margin-top: 8px;">Choose Image</span>
          </div>
        </div>

        <input 
          type="file" 
          #fileInput 
          style="display: none;" 
          accept="image/png, image/jpeg, image/webp" 
          (change)="onFileSelected($event)"
        >

        <div style="color: var(--text-muted); font-size: 13px; max-width: 200px;">
          Recommended format PNG or JPG, max size 2 mb. Click on the circle to upload!
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" style="font-size: 18px; color: #fff;">Username</label>
        <input type="text" class="form-input" [value]="user?.username" disabled>
      </div>

      <div class="form-group" style="margin-top: 24px;">
        <label class="form-label" style="font-size: 18px; color: #fff;">Bio</label>
        <textarea class="form-input" rows="5" placeholder="Tell about yourself...">{{ user?.bio }}</textarea>
      </div>

      <div style="text-align: center; margin-top: 40px;">
        <button class="btn btn-primary" style="padding: 12px 48px; border-radius: 8px;">Create!</button>
      </div>
    </div>
  `
})
export class Profile {
  user: User | null = null;

 constructor(private auth: AuthService) {
    // 1. Берем базовые данные из сервиса
    this.user = this.auth.getSession();

    // 2. Принудительно забираем самую свежую версию профиля из LocalStorage
    const freshData = localStorage.getItem('currentUser');
    if (freshData) {
      this.user = JSON.parse(freshData);
    }
  }

  // Метод обработки выбора картинки
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    
    if (file) {
      // Ограничение в 2 МБ, чтобы LocalStorage не переполнился Base64 строкой
      if (file.size > 2 * 1024 * 1024) {
        alert('File is too large! Please choose an image under 2 MB.');
        return;
      }

      const reader = new FileReader();
      
      // Превращаем картинку в строку Base64
      reader.onload = (e: any) => {
        if (this.user) {
          this.user.avatar = e.target.result;
          
          // Сохраняем в localStorage для текущей сессии
          localStorage.setItem('currentUser', JSON.stringify(this.user));
          
          // Также обновляем пользователя в общем списке пользователей (users), если он там есть
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const userIndex = users.findIndex((u: any) => u.username === this.user?.username);
          if (userIndex !== -1) {
            users[userIndex].avatar = this.user.avatar;
            localStorage.setItem('users', JSON.stringify(users));
          }
        }
      };
      
      reader.readAsDataURL(file);
    }
  }
}