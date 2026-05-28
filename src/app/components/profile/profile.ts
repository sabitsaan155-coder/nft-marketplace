import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { User } from '../../models/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  template: `
    <div style="max-width: 600px;">
      <h1 class="detail-title" style="margin-bottom: 40px;">Create Profile</h1>

      <div style="display: flex; align-items: center; gap: 24px; margin-bottom: 40px;">
        <div style="width: 120px; height: 120px; border-radius: 50%; background: #131a22; border: 1px dashed var(--primary); display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer;">
          <span style="font-size: 24px;">📸</span>
          <span style="color: var(--primary); font-size: 11px; margin-top: 8px;">Choose Image</span>
        </div>
        <div style="color: var(--text-muted); font-size: 13px; max-width: 200px;">
          Recommended format PNG or JPG, size is at least 300x300 px, max size 10 mb
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
    this.user = this.auth.getSession();
  }
}