import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Anime } from '../../services/anime';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

//creo la interface del anime
interface MyAnime {
  mal_id: number;
  title: string;
  images: any;
  score?: number;
  score_user?: number;
  status: 'Pendiente' | 'Viendo' | 'Completado' | 'Abandonado';
  favorite?: boolean;
}

@Component({
  selector: 'app-my-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './my-list.html',
  styleUrls: ['./my-list.css'],
})
export class MyList {
  myList: MyAnime[] = [];
  filteredList: MyAnime[] = [];
  currentFilter: string = 'all';
  editingScoreID: number | null = null;
  tempScore: number | null = null;

  constructor(private animeService: Anime, private router: Router, private toast: ToastService) {}

  ngOnInit() {
    this.loadMyList();

    //Cada vez que se navegue a otra pantalla se cargara la lista de anime, me da muchos problemas sin esto...
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loadMyList();
      }
    });
  }

  //Cargo la lista de anime
  loadMyList() {
    const stored = localStorage.getItem('myList');
    this.myList = stored ? JSON.parse(stored) : [];
    console.log('Lista cargada:', this.myList); //tuve problemas para cargar la lista de anime, ya esta solucionado
    this.applyFilter(this.currentFilter); //aplico el filtro
  }

  //Elimino anime de la lista
  removeAnime(id: number) {
    const anime = this.myList.find((anime: any) => anime.mal_id === id);
    this.myList = this.myList.filter((anime: any) => anime.mal_id !== id);
    localStorage.setItem('myList', JSON.stringify(this.myList));
    this.applyFilter(this.currentFilter); //aplico el filtro
    //Muestro toast
    if (anime) {
      this.toast.showToast(`${anime.title} eliminado de tu lista`, 'error', false);
    }
  }

  //Actualizo el estado del anime
  updateAnimeStatus(id: number, status: MyAnime['status']) {
    const anime = this.myList.find((anime: any) => anime.mal_id === id);
    if (anime) {
      anime.status = status;
      localStorage.setItem('myList', JSON.stringify(this.myList));
      this.applyFilter(this.currentFilter); //aplico el filtro
    }
  }

  //funcion para cambiar estado favorito al anime
  toggleAnimeFavorite(id: number) {
    const anime = this.myList.find((anime: any) => anime.mal_id === id);
    if (anime) {
      anime.favorite = !anime.favorite;
      localStorage.setItem('myList', JSON.stringify(this.myList));
      this.applyFilter(this.currentFilter); //aplico el filtro
    }
  }

  //filtro la lista de anime
  filterList(filter: string) {
    this.currentFilter = filter;
    this.applyFilter(filter);
  }

  applyFilter(filter: string) {
    switch (filter) {
      case 'all':
        this.filteredList = [...this.myList];
        break;
      case 'favorite':
        this.filteredList = this.myList.filter((anime: any) => anime.favorite);
        break;
      default:
        this.filteredList = this.myList.filter((anime: any) => anime.status === filter);
        break;
    }
  }

  //Añado anime a la lista
  addAnime(anime: any) {
    if (!this.myList.some((a: any) => a.mal_id === anime.mal_id)) {
      this.myList.push(anime);
      localStorage.setItem('myList', JSON.stringify(this.myList));
    }
  }

  //Navego a pantalla detalle del anime
  goToAnimeDetail(id: number) {
    this.router.navigate(['/anime', id]);
  }

  ///Metodos para editar la puntuacion del anime

  //Edito la puntuacion del anime
  editScore(anime: MyAnime) {
    this.editingScoreID = anime.mal_id;
    this.tempScore = anime.score_user ?? null;
  }

  //cancelo la edicion de la puntuacion
  cancelEdit() {
    this.editingScoreID = null;
    this.tempScore = null;
  }

  //Guardo la puntuacion del anime
  saveScore(anime: any) {
    if (this.tempScore === null || this.tempScore < 0 || this.tempScore > 10) {
      this.toast.showToast('Puntuacion invalida', 'error', false);
      return;
    }
    anime.score_user = this.tempScore;
    localStorage.setItem('myList', JSON.stringify(this.myList));
    this.toast.showToast(`Tu nota para ${anime.title} se ha guardado`, 'success', true);

    this.editingScoreID = null;
    this.tempScore = null;
  }
}
