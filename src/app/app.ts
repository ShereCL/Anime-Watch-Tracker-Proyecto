import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  protected readonly title = signal('animewatch-tracker');

  //modo oscuro
  isDarkMode = signal(false);

  constructor() {
    const storedTheme = localStorage.getItem('theme');
    this.isDarkMode.set(storedTheme === 'light'); // si no es claro, pasa a oscuro
    this.updateTheme();
  }

  //actualio tema cambiando la clase del body
  updateTheme() {
    if (this.isDarkMode()) {
      document.body.classList.remove('ligth-theme');
    } else {
      document.body.classList.add('dark-theme');
    }
  }

  toggleTheme() {
    const newEstado = !this.isDarkMode();
    this.isDarkMode.set(newEstado);
    localStorage.setItem('theme', newEstado ? 'dark' : 'light');
    this.updateTheme();
  }
}
