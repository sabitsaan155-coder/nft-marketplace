import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="nav-links">
      <a routerLink="/login" routerLinkActive="active">Login/Register</a>
      <a routerLink="/catalog" routerLinkActive="active">NFT's</a>
      <a routerLink="/profile" routerLinkActive="active">Profile</a>
      <a routerLink="/my-nfts" routerLinkActive="active">My NFT's</a>
      <a routerLink="/create" routerLinkActive="active">Create nft</a>
    </nav>
  `
})
export class Nav {
  constructor(public auth: AuthService) {}
}