import { Injectable } from '@angular/core';
import { NFT, Comment } from '../models/nft';

// Массив с нашими 8 карточками должен лежать ЗДЕСЬ, до начала класса
const SEED: NFT[] = [
  { id: 1, name: 'Nightmare (pt.15)', category: 'Games', price: 49.99, creator: 'KKSpecial', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600', description: 'Collection of nightmares', comments: [], voters: [], ownedBy: [], votes: 43 },
  { id: 2, name: 'King Bored Ape', category: 'Collectibles', price: 49.99, creator: 'MorugaNFT', image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600', description: 'Apes collection', comments: [], voters: [], ownedBy: [], votes: 88 },
  { id: 3, name: 'HorseNFT #1332', category: 'Games', price: 49.99, creator: 'User-71068', image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600', description: 'GALLERY_13', comments: [], voters: [], ownedBy: [], votes: 24 },
  { id: 4, name: 'USSR 2.Edition', category: 'Collectibles', price: 49.99, creator: 'Angelina2022', image: 'https://images.unsplash.com/photo-1645516484419-35a747c99474?w=600', description: 'USSR historical assets', comments: [], voters: [], ownedBy: [], votes: 93 },
  { id: 5, name: 'Nightmare (pt.16)', category: 'Games', price: 49.99, creator: 'KKSpecial', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600', description: 'Collection of nightmares', comments: [], voters: [], ownedBy: [], votes: 12 },
  { id: 6, name: 'King Bored Ape v2', category: 'Collectibles', price: 49.99, creator: 'MorugaNFT', image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600', description: 'Apes collection', comments: [], voters: [], ownedBy: [], votes: 55 },
  { id: 7, name: 'HorseNFT #1333', category: 'Games', price: 49.99, creator: 'User-71068', image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600', description: 'GALLERY_13', comments: [], voters: [], ownedBy: [], votes: 19 },
  { id: 8, name: 'USSR 2.Edition 08', category: 'Collectibles', price: 49.99, creator: 'Angelina2022', image: 'https://images.unsplash.com/photo-1645516484419-35a747c99474?w=600', description: 'USSR historical assets', comments: [], voters: [], ownedBy: [], votes: 101 }
];

@Injectable({ providedIn: 'root' })
export class NftService {
  private KEY = 'nftm_items_v3';

  constructor() {
    if (!localStorage.getItem(this.KEY)) {
      localStorage.setItem(this.KEY, JSON.stringify(SEED));
    }
  }

  getAll(): NFT[] {
    return JSON.parse(localStorage.getItem(this.KEY) || '[]');
  }

  getById(id: number): NFT | undefined {
    return this.getAll().find(n => n.id === id);
  }

  private save(nfts: NFT[]): void {
    localStorage.setItem(this.KEY, JSON.stringify(nfts));
  }

  create(nft: Omit<NFT, 'id' | 'votes' | 'voters' | 'comments' | 'ownedBy'>): NFT {
    const all = this.getAll();
    const maxId = Math.max(0, ...all.map(n => n.id));
    const newNFT: NFT = { ...nft, id: maxId + 1, votes: 0, voters: [], comments: [], ownedBy: [] };
    all.push(newNFT);
    this.save(all);
    return newNFT;
  }

  buy(nftId: number, username: string): boolean {
    const all = this.getAll();
    const idx = all.findIndex(n => n.id === nftId);
    if (idx < 0 || all[idx].ownedBy.includes(username)) return false;
    all[idx].ownedBy.push(username);
    this.save(all);
    return true;
  }

  toggleVote(nftId: number, username: string): number {
    const all = this.getAll();
    const idx = all.findIndex(n => n.id === nftId);
    if (idx < 0) return 0;
    const voters = all[idx].voters;
    if (voters.includes(username)) {
      all[idx].voters = voters.filter(u => u !== username);
      all[idx].votes  = Math.max(0, all[idx].votes - 1);
    } else {
      all[idx].voters.push(username);
      all[idx].votes++;
    }
    this.save(all);
    return all[idx].votes;
  }

  addComment(nftId: number, comment: Comment): void {
    const all = this.getAll();
    const idx = all.findIndex(n => n.id === nftId);
    if (idx < 0) return;
    all[idx].comments.push(comment);
    this.save(all);
  }
} 