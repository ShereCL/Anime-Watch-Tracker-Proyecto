import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Anime } from '../../services/anime';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-anime-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './anime-detail.html',
  styleUrls: ['./anime-detail.css'],
})
export class AnimeDetail {
  //Declaración de variables
  animeID: number | null = null;
  animeData: any = null;
  loading: boolean = false;
  episodes: any[] = [];
  reviews: any[] = [];
  loadingEpisodes: boolean = false;
  loadingReviews: boolean = false;
  error: string = '';
  savingAnime: boolean = false;

  //Constructor
  constructor(
    private route: ActivatedRoute,
    private animeService: Anime,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {}

  //Capturo el id del anime
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.animeID = Number(params['id']);
      console.log('Anime ID:', this.animeID); //no carga los datos del anime, compruebo si está trayéndolo bien
      if (this.animeID && !isNaN(this.animeID)) {
        this.loadAnime();
        this.loadEpisodes();
        this.loadReviews();
      }
    });
  }

  //Cargo los datos del anime
  loadAnime() {
    this.loading = true;
    this.error = '';
    this.animeData = null;
    this.cdr.detectChanges();
    this.animeService.getAnimeDetail(this.animeID!).subscribe({
      next: (res: any) => {
        console.log('Respuesta API completa:', res);
        this.animeData = res.data; //Aqui está la información del anime en cuestión
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudo cargar el anime';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
  //metodo para cargar los episodios
  loadEpisodes() {
    this.loadingEpisodes = true;
    this.animeService.getAnimeEpisodes(this.animeID!).subscribe({
      next: (res: any) => {
        this.episodes = res.data || [];
        this.loadingEpisodes = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando episodios:', err);
        this.loadingEpisodes = false;
        this.cdr.detectChanges();
      },
    });
  }

  //Metodo para cargar las reviews de los usuarios
  loadReviews() {
    this.loadingReviews = true;
    this.animeService.getAnimeReviews(this.animeID!).subscribe({
      next: (res: any) => {
        this.reviews = res.data || [];
        this.loadingReviews = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando reseñas:', err);
        this.loadingReviews = false;
        this.cdr.detectChanges();
      },
    });
  }

  //Metodo para añadir a mi lista un anime desde el home. Declaro el mismo metodo en el home par evitar duplicados
  addAnimeToMyList(anime: any) {
    const stored = localStorage.getItem('myList');
    const myList = stored ? JSON.parse(stored) : [];
    if (!myList.some((a: any) => a.mal_id === anime.mal_id)) {
      myList.push(anime);
      localStorage.setItem('myList', JSON.stringify(myList));
      this.toast.showToast(`${anime.title} agregado a tu lista`, 'success', true);
    } else {
      this.toast.showToast(`${anime.title} ya está en tu lista`, 'error', false);
    }
  }

  //Metodo para navegar a mi lista
  goBack() {
    this.router.navigate(['/']);
  }
}
