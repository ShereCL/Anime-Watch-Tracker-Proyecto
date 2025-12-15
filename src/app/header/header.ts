import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  darkMode = signal(true);

  toggleTheme() {
    this.darkMode.set(!this.darkMode());
    this.applyTheme();
    localStorage.setItem('theme', this.darkMode() ? 'dark' : 'light');
  }

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    this.darkMode.set(savedTheme !== 'light');
    this.applyTheme();
  }

  //aplicar el tema
  private applyTheme() {
    const body = document.body;
    if (this.darkMode()) {
      body.classList.add('dark');
      body.classList.remove('light');
    } else {
      body.classList.add('light');
      body.classList.remove('dark');
    }
  }
}
