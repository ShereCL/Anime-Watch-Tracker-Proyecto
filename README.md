# 🎌 Anime Watch Tracker

Aplicación web desarrollada con **Angular** para descubrir, explorar y llevar el seguimiento de animes, usando la API pública de **Jikan** (MyAnimeList). Permite buscar series, consultar su ficha completa con episodios y reseñas, descubrir nuevos animes al estilo *swipe*, y organizar tu propia lista personal con estado, puntuación y favoritos.

## ✨ Funcionalidades

### Inicio
- Buscador de animes por título, con filtros por tipo y estado.
- Top 10 animes según Jikan/MyAnimeList.
- **Anime del día**, elegido al azar entre un lote de animes aleatorios.
- Modo **descubrimiento estilo Tinder**: tarjetas de animes aleatorios que se deslizan a la derecha para añadir a la lista o a la izquierda para descartar.
- Resumen rápido de tu lista personal: total de animes, horas estimadas de visionado (a partir del número de episodios) y los géneros que más ves.

### Ficha de anime
- Información detallada del anime (sinopsis, valoración, datos generales).
- Listado de episodios.
- Reseñas de la comunidad de MyAnimeList.
- Botón para añadir directamente a tu lista personal.

### Mi lista
- Seguimiento de cada anime con estado: **Pendiente**, **Viendo**, **Completado** o **Abandonado**.
- Marcar animes como favoritos.
- Puntuación personal (0–10) editable por anime.
- Filtros por estado o por favoritos.
- Eliminar animes de la lista.

### Interfaz
- Cambio de tema claro/oscuro, persistente entre sesiones.
- Notificaciones tipo *toast* para confirmar acciones (añadir, eliminar, guardar puntuación, errores).

## 🛠️ Stack técnico

| Categoría | Tecnología |
|---|---|
| Framework | Angular 21 (standalone components) |
| Lenguaje | TypeScript |
| HTTP | Angular `HttpClient` + RxJS (`forkJoin` para peticiones en paralelo) |
| Persistencia | `localStorage` del navegador |
| API de contenido | [Jikan API](https://docs.api.jikan.moe/) (API no oficial de MyAnimeList) |
| Estilos | CSS, con soporte de tema claro/oscuro |

## 📂 Estructura del proyecto

```
src/app/
├── header/         # Cabecera y toggle de tema claro/oscuro
├── footer/         # Pie de página
├── pages/
│   ├── home/         # Búsqueda, top animes, descubrimiento estilo swipe, estadísticas
│   ├── anime-detail/  # Ficha de anime: detalle, episodios y reseñas
│   └── my-list/       # Lista personal: estados, favoritos, puntuación y filtros
└── services/
    ├── anime.ts          # Llamadas a la API de Jikan
    ├── storage.ts         # Reservado para abstraer la persistencia (actualmente sin uso; se usa localStorage directo)
    └── toast.service.ts   # Notificaciones tipo toast
```

> 📌 La lista personal se guarda bajo la clave `myList` en `localStorage`, por lo que es local a cada navegador/dispositivo y no requiere registro ni backend.

## 🚀 Cómo ejecutar el proyecto

1. Clona el repositorio e instala las dependencias:
   ```bash
   npm install
   ```
2. Levanta el servidor de desarrollo:
   ```bash
   ng serve
   ```
3. Abre `http://localhost:4200/` en el navegador.

### Otros comandos útiles

```bash
ng build      # Compila el proyecto para producción
ng test       # Ejecuta los tests unitarios con Vitest
```

## 📌 Estado del proyecto

Proyecto funcional con persistencia local. El servicio `Storage` está creado pero aún no se usa: actualmente las páginas acceden a `localStorage` directamente.
