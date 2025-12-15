import { Injectable } from '@angular/core';

// Creo el servicio ToastService, para los mensajes que salen por pantalla
//he buscado como hacerlo y los pasos a seguir.
//El service evita duplicado de código en los distintos componenetes

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  showToast(message: string, type: 'success' | 'error' = 'success', showLoader: boolean = true) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const loaderHTML = showLoader ? `<div class="loading-bar"></div>` : '';
    toast.innerHTML = `
      ${loaderHTML}
      <div class="toast-message">${message}</div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }
  // doy forma y estilos al toast para que no salga el mensjito feo del alert por pantalla
}
