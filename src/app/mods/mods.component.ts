import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { UserService } from '../_services/user.service';
import { Observable } from 'rxjs';
import { AlertService } from '../_services/alert.service';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-mods',
  templateUrl: './mods.component.html',
  styleUrls: ['./mods.component.css']
})
export class ModsComponent {

  loadingDuration: number = 100;

  archivoSubida: File | null = null;
  archivos: string[] = [];

  constructor(private http: HttpClient, private userService: UserService, private alertService: AlertService, private loadingController: LoadingController) { }

  ngOnInit() {
    this.getMods();
  }

  onFileSelected(event: any) {
    this.archivoSubida = event.target.files[0];
  }

  onUpload() {
    const formData = new FormData();
    if (this.archivoSubida) {
      formData.append('file', this.archivoSubida, this.archivoSubida.name);
      console.log(this.archivoSubida);

      this.http.post('http://blackdiamond.ddns.net:3005/upload', formData)
        .subscribe((response) => {
          console.log('Archivo subido exitosamente', response);
          this.alertService.showSuccess('Mod subido con éxito');
          this.getMods();
        });
    }else{
      this.alertService.showError('No se ha seleccionado ningun mod');
    }
  }

  onDownload(archivo: string) {
      this.userService.onDownload(archivo).subscribe((response) => {
        // Descarga exitosa

        // Asegurarte de que archivoSeleccionado no es null
        const fileName = archivo;

        // Crear un enlace temporal para descargar el archivo
        const blob = new Blob([response.body as BlobPart], { type: response.headers.get('Content-Type') || 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, (error) => {
        console.error('Error al descargar el archivo', error);
      });
  }

  onDownloadAll() {
    if (this.archivos.length > 0) {
      // Puedes ajustar la lógica según cómo quieras implementar la descarga de todos los mods a la vez
      this.archivos.forEach((archivo) => {
        // Lógica para la descarga de cada archivo (similar a onDownload)
        this.userService.onDownload(archivo).subscribe((response) => {
          const contentDispositionHeader = response.headers.get('Content-Disposition');
          const fileName = archivo || 'archivo_descargado';

          const blob = new Blob([response.body as BlobPart], { type: response.headers.get('Content-Type') || 'application/octet-stream' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        });
      });
    }
  }

  onDelete(archivo: string) {
    if (archivo) {
      this.userService.delete(archivo).subscribe(
        (response) => {
          console.log('Archivo eliminado exitosamente', response);
          this.alertService.showSuccess('Mod eliminado con éxito');
          this.getMods();
        },
        (error) => {
          console.error('Error al eliminar el archivo', error);
        }
      );
    }
  }

  async getMods() {

    const loading = await this.loadingController.create({
      duration: this.loadingDuration, // Duración en milisegundos
      spinner: 'crescent', // Puedes cambiar esto según el estilo que prefieras (otros valores posibles: 'dots', 'bubbles', 'circles')
      cssClass: 'custom-loading',
      mode: 'ios',
    });
  
    await loading.present();

    this.userService.getMods().subscribe((archivos) => {
      this.archivos = archivos.mods;
    });
  }
}