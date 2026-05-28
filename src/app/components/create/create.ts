import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { NftService } from '../../services/nft';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-create', // строго под твой проект
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
<div class="page" style="display: flex; justify-content: center; align-items: center; min-height: 80vh;">
  <div class="auth-card" style="background: var(--surface); border: 1px solid var(--border); padding: 40px; border-radius: 16px; max-width: 500px; width: 100%;">
    <h2 style="color: #fff; margin-bottom: 8px; text-align: center;">Создать новый NFT</h2>
    <p style="color: rgba(255,255,255,0.5); text-align: center; margin-bottom: 24px; font-size: 14px;">Выставите своё цифровое искусство на маркетплейс</p>

    <form (ngSubmit)="onSubmit()">
      <div style="margin-bottom: 16px;">
        <label style="display: block; color: rgba(255,255,255,0.7); margin-bottom: 8px; font-size: 14px;">Название NFT</label>
        <input type="text" [(ngModel)]="name" name="name" required style="width: 100%; background: var(--surface2); border: 1px solid var(--border); padding: 12px; border-radius: 8px; color: #fff; font-family: inherit;">
      </div>

      <div style="margin-bottom: 16px;">
        <label style="display: block; color: rgba(255,255,255,0.7); margin-bottom: 8px; font-size: 14px;">Категория</label>
        <select [(ngModel)]="category" name="category" style="width: 100%; background: var(--surface2); border: 1px solid var(--border); padding: 12px; border-radius: 8px; color: #fff; font-family: inherit; cursor: pointer;">
          <option value="Искусство">Искусство</option>
          <option value="Игры">Игры</option>
          <option value="Фотография">Фотография</option>
          <option value="Мемы">Мемы</option>
        </select>
      </div>

      <div style="margin-bottom: 16px;">
        <label style="display: block; color: rgba(255,255,255,0.7); margin-bottom: 8px; font-size: 14px;">Цена (в ETH)</label>
        <input type="number" step="0.01" [(ngModel)]="price" name="price" required style="width: 100%; background: var(--surface2); border: 1px solid var(--border); padding: 12px; border-radius: 8px; color: #fff; font-family: inherit;">
      </div>

      <div style="margin-bottom: 16px;">
        <label style="display: block; color: rgba(255,255,255,0.7); margin-bottom: 8px; font-size: 14px;">Ссылка на изображение (URL)</label>
        <input type="text" [(ngModel)]="image" name="image" placeholder="https://..." required style="width: 100%; background: var(--surface2); border: 1px solid var(--border); padding: 12px; border-radius: 8px; color: #fff; font-family: inherit;">
      </div>

      <div style="margin-bottom: 24px;">
        <label style="display: block; color: rgba(255,255,255,0.7); margin-bottom: 8px; font-size: 14px;">Описание</label>
        <textarea [(ngModel)]="description" name="description" rows="3" required style="width: 100%; background: var(--surface2); border: 1px solid var(--border); padding: 12px; border-radius: 8px; color: #fff; font-family: inherit; resize: none;"></textarea>
      </div>

      <button type="submit" class="btn btn-primary" style="width: 100%; padding: 14px;">Опубликовать</button>
    </form>
  </div>
</div>
  `
})
export class Create implements OnInit { // Класс называется просто Create
  name = '';
  category = 'Искусство';
  price = 0.1;
  image = '';
  description = '';

  constructor(
    private nftService: NftService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  onSubmit() {
    const user = this.auth.getSession();
    if (!user) return;

    if (!this.name || !this.image || !this.description || this.price <= 0) {
      alert('Пожалуйста, заполните все поля корректно');
      return;
    }

    this.nftService.create({
      name: this.name,
      category: this.category,
      price: this.price,
      image: this.image,
      description: this.description,
      creator: user.username
    });

    this.router.navigate(['/catalog']);
  }
}