import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { NftService } from '../../services/nft';
import { AuthService } from '../../services/auth';
import { NFT } from '../../models/nft';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf],
  template: `
    <div class="section-header">
      <h1 class="detail-title">NFT's</h1>
    </div>
    
    <div style="margin-bottom: 32px;">
      <input type="text" class="form-input" style="max-width: 300px; border-radius: 12px;" placeholder="🔍 Search" #searchInput (keyup)="onSearch(searchInput.value)">
    </div>

    <div class="nft-grid">
      <div class="nft-card" *ngFor="let item of filteredNfts" [routerLink]="['/nft', item.id]">
        <div style="display: flex; justify-content: space-between; padding: 12px 16px; align-items: center;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 24px; height: 24px; border-radius: 50%; background: #ccc;"></div>
            <span style="font-size: 12px; color: var(--primary);">{{ item.creator }}</span>
          </div>
          <div style="font-size: 12px; color: var(--primary);">♥ {{ item.votes }}</div>
        </div>

        <div class="nft-img-wrap">
          <img class="nft-img" [src]="item.image" [alt]="item.name" loading="lazy" />
        </div>
        
        <div class="nft-info">
          <div class="nft-collection-name">Collection name</div>
          <div class="nft-name">{{ item.name }}</div>
          <div class="nft-price">$ {{ item.price }}</div>
          <button class="btn-buy-card" (click)="buy($event, item.id)">Buy</button>
        </div>
      </div>
    </div>

    <div class="modal-backdrop" *ngIf="showModal" style="position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); display:flex; align-items:center; justify-content:center; z-index:1000;">
      <div class="modal-content" style="background:#0d131a; border:1px solid var(--teal); padding:40px; border-radius:16px; text-align:center;">
        <h2 style="color:white;">🎉 Поздравляем!</h2>
        <p style="color:white;">Вы успешно приобрели NFT!</p>
        <button class="btn btn-primary" (click)="showModal = false" style="padding:10px 20px; cursor:pointer;">Отлично</button>
      </div>
    </div>
  `
})
export class Catalog {
  nfts: NFT[] = [];
  filteredNfts: NFT[] = [];
  showModal = false;

  constructor(private nftService: NftService, private auth: AuthService) {
    this.nfts = this.nftService.getAll();
    this.filteredNfts = this.nfts;
  }

  onSearch(query: string) {
    const q = query.toLowerCase();
    this.filteredNfts = this.nfts.filter(n => n.name.toLowerCase().includes(q));
  }

  buy(event: Event, id: number) {
    event.stopPropagation();
    const user = this.auth.getSession();
    if (!user) {
      alert('Войдите в аккаунт!');
      return;
    }
    const success = this.nftService.buy(id, user.username);
    if (success) {
      this.showModal = true;
    } else {
      alert('❌ Вы уже владеете этим NFT!');
    }
  }
}