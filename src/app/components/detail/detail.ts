import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NftService } from '../../services/nft';
import { AuthService } from '../../services/auth';
import { NFT } from '../../models/nft';
import { User } from '../../models/user';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, RouterLink],
  template: `
<div class="page" *ngIf="nft" style="padding: 20px 40px;">

  <button class="btn btn-ghost" routerLink="/catalog" style="margin-bottom: 24px;">
    ← Назад в каталог
  </button>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start;">

    <div>
      <img
        [src]="nft.image"
        [alt]="nft.name"
        style="width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 16px; border: 1px solid var(--border); display: block; box-shadow: 0 10px 30px rgba(0,229,196,0.1);"
      />

      <div style="margin-top: 24px;">
        <h3 style="color: #fff; font-size: 18px; margin-bottom: 12px;">NFT Description</h3>
        <p style="color: rgba(255,255,255,0.65); line-height: 1.75; font-size: 15px; text-align: justify;">
          This digital asset is part of our exclusive limited edition collection, crafted with unique artistic elements that blend traditional aesthetics with futuristic themes. 
          Every detail has been meticulously designed to provide a rich visual experience that evolves as you view it from different angles. 
          Owning this NFT gives you not only a piece of digital art but also membership to our community of visionary creators.
        </p>
      </div>
    </div>

    <div>

      <div style="margin-bottom: 16px;">
        <span class="nft-badge" style="display: inline-block; margin-bottom: 12px;">{{ nft.category }}</span>
        <p style="color: rgba(255,255,255,0.5); font-size: 14px; margin: 0;">
          Создатель: <span style="color: var(--primary);">@{{ nft.creator }}</span>
        </p>
      </div>

      <h1 style="font-size: 32px; font-weight: 800; color: #fff; margin-bottom: 24px; line-height: 1.2;">
        {{ nft.name }}
      </h1>

      <div style="background: var(--surface); border: 1px solid var(--border); padding: 24px; border-radius: 12px; margin-bottom: 24px;">
        <div style="color: rgba(255,255,255,0.4); font-size: 13px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
          Текущая цена
        </div>
        <div style="font-size: 30px; font-weight: 800; color: var(--primary); margin-bottom: 20px;">
          $ {{ nft.price }}
        </div>

        <button
          class="btn btn-primary"
          style="width: 100%; padding: 14px; font-size: 16px;"
          *ngIf="user && !isOwned"
          (click)="buy()"
        >
          Купить этот NFT
        </button>

        <div
          *ngIf="isOwned"
          style="text-align: center; color: var(--primary); font-weight: bold; padding: 12px; background: rgba(0,229,196,0.1); border-radius: 8px;"
        >
          ✓ Вы владеете этим NFT
        </div>

        <div
          *ngIf="!user"
          style="text-align: center; color: rgba(255,255,255,0.4); font-size: 14px; padding: 8px;"
        >
          <a routerLink="/login" style="color: var(--primary); cursor: pointer;">Войдите</a>, чтобы купить
        </div>
      </div>

      <div style="margin-bottom: 32px; display: flex; align-items: center; gap: 12px;">
        <button
          class="btn"
          [class.btn-primary]="hasVoted"
          [class.btn-ghost]="!hasVoted"
          (click)="vote()"
        >
          {{ hasVoted ? '▲ Голос учтен' : '▲ Проголосовать' }}
        </button>
        <span style="color: rgba(255,255,255,0.5); font-size: 14px;">{{ nft.votes }} голосов</span>
      </div>

      <div style="border-top: 1px solid var(--border); padding-top: 24px;">
        <h3 style="color: #fff; font-size: 18px; margin-bottom: 20px;">
          Комментарии ({{ nft.comments.length }})
        </h3>

        <div *ngIf="user" style="margin-bottom: 20px;">
          <textarea
            [(ngModel)]="commentText"
            placeholder="Напишите ваше мнение..."
            rows="3"
            style="width: 100%; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; color: #fff; padding: 12px; resize: none; margin-bottom: 10px; font-family: inherit; font-size: 14px;"
          ></textarea>
          <button class="btn btn-primary" (click)="addComment()" [disabled]="!commentText.trim()">
            Отправить
          </button>
        </div>

        <div *ngIf="!user" style="background: rgba(0,229,196,0.08); border: 1px solid rgba(0,229,196,0.2); border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; font-size: 14px; color: rgba(255,255,255,0.6);">
          🔒 <a routerLink="/login" style="color: var(--primary); cursor: pointer; text-decoration: underline;">Войдите</a>, чтобы оставить комментарий
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div
            *ngFor="let c of nft.comments"
            style="background: var(--surface); border: 1px solid var(--border); padding: 14px 16px; border-radius: 10px;"
          >
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <strong style="color: var(--primary); font-size: 14px;">@{{ c.author }}</strong>
              <span style="color: rgba(255,255,255,0.3); font-size: 12px;">{{ c.date }}</span>
            </div>
            <p style="color: rgba(255,255,255,0.8); font-size: 14px; line-height: 1.6; margin: 0;">
              {{ c.text }}
            </p>
          </div>

          <div *ngIf="nft.comments.length === 0" style="color: rgba(255,255,255,0.35); font-style: italic; font-size: 14px;">
            Комментариев пока нет. Будьте первым!
          </div>
        </div>
      </div>
    </div>
  </div>

  <div style="margin-top: 60px; border-top: 1px solid var(--border); padding-top: 40px;">
    <h2 style="color: #fff; font-size: 22px; font-weight: 700; margin-bottom: 24px;">
      {{ moreTitle }}
    </h2>

    <div class="nft-grid" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));">
      <div class="nft-card" *ngFor="let item of moreNfts" [routerLink]="['/nft', item.id]">
        <div style="display: flex; justify-content: space-between; padding: 10px 14px; align-items: center;">
          <span style="font-size: 12px; color: var(--primary);">{{ item.creator }}</span>
          <span style="font-size: 12px; color: var(--primary);">♥ {{ item.votes }}</span>
        </div>
        <div class="nft-img-wrap">
          <img class="nft-img" [src]="item.image" [alt]="item.name" loading="lazy" />
        </div>
        <div class="nft-info">
          <div class="nft-name">{{ item.name }}</div>
          <div class="nft-meta-row" style="display: flex; gap: 16px; margin: 6px 0;">
            <div style="font-size: 12px; color: rgba(255,255,255,0.4);">
              Category<br><span style="color: rgba(255,255,255,0.7);">{{ item.category }}</span>
            </div>
          </div>
          <div class="nft-price">$ {{ item.price }}</div>
          <button class="btn-buy-card" (click)="quickBuy($event, item.id)">Buy</button>
        </div>
      </div>
    </div>
  </div>

  <div
    *ngIf="showModal"
    style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 1000;"
  >
    <div style="background: #0d131a; border: 1px solid var(--border); padding: 40px; border-radius: 20px; text-align: center; max-width: 380px; width: 90%;">
      <div style="font-size: 52px; margin-bottom: 12px;">🎉</div>
      <img [src]="nft.image" style="width: 120px; height: 120px; border-radius: 12px; object-fit: cover; margin-bottom: 16px; border: 2px solid var(--primary);" />
      <h2 style="color: #fff; font-size: 24px; margin-bottom: 8px;">Поздравляем!</h2>
      <p style="color: rgba(255,255,255,0.6); margin-bottom: 24px;">
        «{{ nft.name }}» теперь в вашей коллекции!
      </p>
      <button class="btn btn-primary" style="width: 100%; padding: 14px;" (click)="showModal = false">
        Отлично 🚀
      </button>
    </div>
  </div>

</div>
  `
})

// === ТВОЯ РАБОЧАЯ ЛОГИКА БЕЗ ИЗМЕНЕНИЙ ===
export class Detail implements OnInit {
  nft: NFT | undefined;
  user: User | null = null;
  isOwned = false;
  hasVoted = false;
  commentText = '';
  showModal = false;
  
  moreNfts: NFT[] = [];
  moreTitle = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private nftService: NftService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.auth.getSession();
    this.route.params.subscribe(p => {
      const id = +p['id'];
      this.load(id);
    });
  }

  load(id: number): void {
    const allNfts = this.nftService.getAll();
    const found = allNfts.find(n => n.id === id);
    
    if (!found) {
      this.router.navigate(['/']);
      return;
    }
    
    this.nft = found;
    this.isOwned = !!this.user && this.nft.ownedBy.includes(this.user.username);
    this.hasVoted = !!this.user && this.nft.voters.includes(this.user.username);
    
    const authorNfts = allNfts.filter(n => n.creator === this.nft?.creator && n.id !== this.nft?.id);
    
    if (authorNfts.length > 0) {
      this.moreNfts = authorNfts;
      this.moreTitle = `More by ${this.nft.creator}`;
    } else {
      this.moreNfts = allNfts.filter(n => n.id !== this.nft?.id).slice(0, 4);
      this.moreTitle = 'Explore other NFTs';
    }
  }

  buy(): void {
    if (!this.user || !this.nft) return;
    const success = this.nftService.buy(this.nft.id, this.user.username);
    if (success) {
      this.load(this.nft.id);
      this.showModal = true;
    }
  }

  vote(): void {
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }
    if (!this.nft) return;
    this.nftService.toggleVote(this.nft.id, this.user.username);
    this.load(this.nft.id);
  }

  addComment(): void {
    if (!this.user || !this.nft || !this.commentText.trim()) return;
    
    const newComment = {
      author: this.user.username,
      text: this.commentText.trim(),
      date: new Date().toISOString().split('T')[0]
    };

    this.nftService.addComment(this.nft.id, newComment);
    this.commentText = '';
    this.load(this.nft.id);
  }

  quickBuy(event: Event, id: number): void {
    event.stopPropagation();
    if (!this.user) {
      alert('Войдите в аккаунт, чтобы совершить покупку!');
      return;
    }
    const success = this.nftService.buy(id, this.user.username);
    if (success) {
      alert('🎉 Успешно куплено!');
    } else {
      alert('❌ Вы уже владеете этим NFT!');
    }
  }
}