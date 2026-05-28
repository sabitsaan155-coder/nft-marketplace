import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NftService } from '../../services/nft';
import { AuthService } from '../../services/auth';
import { NFT } from '../../models/nft';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-my-nfts',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf],
  template: `
    <div class="section-header">
      <h1 class="detail-title">My NFT's</h1>
    </div>
    
    <div class="nft-grid" style="margin-top: 20px;">
      <div class="nft-card" *ngFor="let item of myNfts" [routerLink]="['/nft', item.id]">
        <div class="nft-img-wrap"><img [src]="item.image" [alt]="item.name" style="width:100%; border-radius: 12px;"></div>
        <div class="nft-info">
          <div class="nft-name">{{ item.name }}</div>
          <div class="nft-price">$ {{ item.price }}</div>
        </div>
      </div>
      
      <div *ngIf="myNfts.length === 0" style="color: #fff; padding: 20px;">
        У вас пока нет купленных NFT.
      </div>
    </div>
  `
})
export class MyNfts {
  myNfts: NFT[] = [];

  constructor(private nftService: NftService, private auth: AuthService) {
    const user = this.auth.getSession();
    if (user) {
      // Берем все NFT и фильтруем те, где наш username есть в массиве ownedBy
      this.myNfts = this.nftService.getAll().filter(n => n.ownedBy.includes(user.username));
    }
  }
}