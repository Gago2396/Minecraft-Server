// alert.service.ts
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private toastController: ToastController) {}

  async showSuccess(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      cssClass: 'success-toast', // Clase para estilos específicos
    });
    toast.present();
  }

  async showError(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      cssClass: 'error-toast', // Clase para estilos específicos
    });
    toast.present();
  }
}
