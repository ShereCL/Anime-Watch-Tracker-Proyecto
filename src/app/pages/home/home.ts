import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Anime } from '../../services/anime';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../services/toast.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit {
  searchQuery: string = '';
  results: any[] = [];
  loading: boolean = false;
  error: string = '';
  hasResults: boolean = false;
  topAnimes: any[] = [];
  loadingTop: boolean = false;
  searchForm!: FormGroup;
  discoveryAnimes: any[] = [];
  currentDiscoveryIndex: number = 0;
  swipeIndex: number | null = null;
  swipeDirection: 'left' | 'right' | null = null;
  animeOfTheDay: any;
  myListStats = {
    total: 0,
    totalHours: 0,
    topGenres: [] as { name: string; count: number }[],
  };

  constructor(
    private animeService: Anime,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private toast: ToastService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      query: [''],
      type: [''],
      status: [''],
    });
    this.loadTopAnimes();
    this.loadDiscoveryAnimes();
    this.calculateMyListStats();
  }

  //Cargar animes card "estilo tinder"
  loadDiscoveryAnimes() {
    this.animeService.getRandomAnimes(12).subscribe({
      next: (res: any) => {
        console.log('Discovery animes:', res);
        this.discoveryAnimes = res || [];
        this.currentDiscoveryIndex = 0;
        this.animeOfTheDay =
          this.discoveryAnimes[Math.floor(Math.random() * this.discoveryAnimes.length)];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading discovery animes:', err);
      },
    });
  }

  swipeRight(anime: any) {
    this.swipeIndex = this.currentDiscoveryIndex;
    this.swipeDirection = 'right';
    setTimeout(() => {
      const stored = localStorage.getItem('myList');
      const myList = stored ? JSON.parse(stored) : [];
      //evito los duplicados
      if (!myList.some((a: any) => a.mal_id === anime.mal_id)) {
        myList.push(anime);
        localStorage.setItem('myList', JSON.stringify(myList));
        this.toast.showToast(`${anime.title} agregado a tu lista`, 'success', true);
      } else {
        this.toast.showToast(`${anime.title} ya está en tu lista`, 'error', false);
      }
      this.nextDiscoveryCard();
      this.swipeIndex = null;
      this.swipeDirection = null;
    }, 300);
  }

  swipeLeft() {
    this.swipeIndex = this.currentDiscoveryIndex;
    this.swipeDirection = 'left';
    setTimeout(() => {
      this.nextDiscoveryCard();
      this.swipeIndex = null;
      this.swipeDirection = null;
    }, 300);
  }

  nextDiscoveryCard() {
    this.currentDiscoveryIndex++;
    if (this.currentDiscoveryIndex >= this.discoveryAnimes.length) {
      this.loadDiscoveryAnimes();
    }
  }

  private isSearching = false; // Añade esta variable

  search() {
    if (this.isSearching) {
      return;
    }

    const { query, type, status } = this.searchForm.value;

    if (!query || !query.trim()) {
      this.error = 'Por favor ingresa un término de búsqueda';
      return;
    }

    this.isSearching = true;
    this.loading = true;
    this.error = '';
    this.results = [];

    this.animeService.searchAnime(query, type, status).subscribe({
      next: (res: any) => {
        this.results = [...res.data];
        this.loading = false;
        this.isSearching = false;

        if (this.results.length === 0) {
          this.error = 'No se encontraron resultados';
        }

        this.cdr.detectChanges(); // Forzar detección después de cambiar todo
      },
      error: (err) => {
        this.error = 'Ocurrió un error al realizar la búsqueda del Anime';
        this.loading = false;
        this.isSearching = false;
        this.cdr.detectChanges();
      },
    });
  }
  //Busqueda al presionar enter
  onKeyEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.search();
    }
  }

  //Navego a la pagina de detalle del anime
  goAnimeDetail(id: number) {
    this.router.navigate(['/anime', id]);
  }

  //Metodo para añadir a mi lista un anime desde el home
  addAnimeToMyList(anime: any) {
    const stored = localStorage.getItem('myList');
    const myList = stored ? JSON.parse(stored) : [];
    //Esto evita duplicados
    if (!myList.some((a: any) => a.mal_id === anime.mal_id)) {
      myList.push(anime);
      localStorage.setItem('myList', JSON.stringify(myList));
      this.toast.showToast(`${anime.title} agregado a tu lista`, 'success', true);
    } else {
      this.toast.showToast(`${anime.title} ya está en tu lista`, 'error', false);
    }
  }

  //Metodo para navegar a mi lista
  goMyList() {
    this.router.navigate(['/my-list']);
  }

  //Metodo para cargar los animes top
  loadTopAnimes() {
    this.loadingTop = true;
    this.animeService.getTopAnimes().subscribe({
      next: (res: any) => {
        console.log('Top animes:', res);
        this.topAnimes = res.data.slice(0, 10);
        this.loadingTop = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading top animes:', err);
        this.error = 'Ocurrió un error al cargar los animes top';
        this.loadingTop = false;
        this.cdr.detectChanges();
      },
    });
  }
  //Metodo para limpiar los filtros
  clearFilters() {
    this.searchForm.reset({
      query: '',
      type: '',
      status: '',
    });
    this.results = [];
    this.error = '';
    this.hasResults = false;
    this.cdr.detectChanges();
  }
  //Calcula los géneros mas vistos dentro de mi lista personal
  calculateMyListStats() {
    const stored = localStorage.getItem('myList');
    const myList = stored ? JSON.parse(stored) : [];

    // Total de animes
    this.myListStats.total = myList.length;

    // Calcular horas totales (promedio 24 min por episodio)
    this.myListStats.totalHours = myList.reduce((total: number, anime: any) => {
      const episodes = anime.episodes || 12;
      return total + (episodes * 24) / 60;
    }, 0);

    // Calcular géneros más vistos
    const genreCount: { [key: string]: number } = {};

    myList.forEach((anime: any) => {
      if (anime.genres) {
        anime.genres.forEach((genre: any) => {
          genreCount[genre.name] = (genreCount[genre.name] || 0) + 1;
        });
      }
    });
    //este array me saca el top 5 de géneros mas vistos
    this.myListStats.topGenres = Object.entries(genreCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }
}
