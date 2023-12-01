// home.component.ts

import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service'; // Ajusta la ruta según la ubicación real
import { AlertService } from '../_services/alert.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  loadingDuration: number = 100;

  estadoServidor: boolean = false;
  jugadores: any = []
  stevePresente: boolean = false;
  alexPresente: boolean = false;
  imagenSteve: string = 'steve_disc.png';
  imagenAlex: string = 'alex_disc.jpg';
  botSeleccionado: string | null = null;
  coordenadaX: number = 128;
  coordenadaY: number = 64;
  coordenadaZ: number = -160;

  custom: boolean = true;


  constructor(private userService: UserService, private alertService: AlertService, private loadingController: LoadingController) { }

  ngOnInit(): void {
    this.recargar();
  }

  async recargar() {
    const loading = await this.loadingController.create({
      duration: this.loadingDuration, // Duración en milisegundos
      spinner: 'crescent', // Puedes cambiar esto según el estilo que prefieras (otros valores posibles: 'dots', 'bubbles', 'circles')
      cssClass: 'custom-loading',
      mode: 'ios',
    });

    await loading.present();

    await this.obtenerJugadores();
    await this.obtenerEstadoServidor();

    setTimeout(() => {
      loading.dismiss(); // Cierra la pantalla de carga después de 2 segundos (o el tiempo que hayas definido)
    }, 2000);

  }

  seleccionarBot(bot: string) {
    if (this.botSeleccionado === bot) {
      this.botSeleccionado = null;
    } else {
      this.botSeleccionado = bot;
    }
  }


  async obtenerEstadoServidor() {
    this.userService.getStatus().subscribe(
      (data: any) => {
        this.estadoServidor = data.online;
      },
      error => {
        console.error('Error al obtener el estado del servidor', error);
      }
    );
  }

  async obtenerJugadores() {
    this.userService.executeCommand('/list').subscribe(
      (response: string) => {
        const [, nombresParte2] = response.split(':');
        this.jugadores = nombresParte2.replace('\n', '').split(',').map(nombre => nombre.trim());
        this.stevePresente = this.jugadores.includes('Steve');
        this.imagenSteve = this.stevePresente ? 'steve.png' : 'steve_disc.png';
        this.alexPresente = this.jugadores.includes('Alex');
        this.imagenAlex = this.alexPresente ? 'alex.jpg' : 'alex_disc.jpg';
      },
      (error) => {
        console.error('Error al obtener jugadores', error);
      }
    );
  }


  iniciarServidor(): void {
    this.userService.startServer().subscribe(
      (data: any) => {
        if (data === 'Minecraft server is already running.') {
          this.alertService.showError(data);
        } else {
          this.alertService.showSuccess(data.message);
        }
      },
      error => {
        console.log(error);
        this.alertService.showError(error.error.error);
      }
    );
  }

  apagarServidor(): void {
    this.userService.stopServer().subscribe(
      (data: any) => {
        this.alertService.showSuccess(data.message);
      },
      error => {
        console.error('Error:', error);
        this.alertService.showError(error.error.error);
      }
    );
  }

  addBot() {
    if (this.botSeleccionado) {
      var coordenadas = this.coordenadaX + ' ' + this.coordenadaY + ' ' + this.coordenadaZ;
      this.userService.executeCommand('/player ' + this.botSeleccionado + ' spawn at ' + coordenadas).subscribe(
        (data: any) => {
          if (data.includes('joined')) {
            this.alertService.showSuccess(data);
            this.recargar();
          } else {
            this.alertService.showError(data);
          }
        },
        error => {
          console.error('Error:', error);
          this.alertService.showError(error.error.message);
        }
      );
      this.botSeleccionado = null;
    } else {
      this.alertService.showError('No has seleccionado ningún bot');
    }
  }

  //Steve[local] logged in with entity id 28232 at (128.0, 64.0, -160.0) Steve joined the game

  quitBot() {
    if (this.botSeleccionado) {
      this.userService.executeCommand('/player ' + this.botSeleccionado + ' kill').subscribe(
        (data: any) => {
          if (data.includes('Killed')) {
            this.alertService.showSuccess(data);
            this.recargar();
          } else {
            // Error al eliminar el bot
            this.alertService.showError(data);
          }
        },
        error => {
          console.error('Error:', error);
          this.alertService.showError(error);
        }
      );
      this.botSeleccionado = null;
    } else {
      this.alertService.showError('No has seleccionado ningún bot');
    }
  }

  //Steve lost connection: Killed Steve left the game

  moveBot() {
    if (this.botSeleccionado) {
      var coordenadas = this.coordenadaX + ' ' + this.coordenadaY + ' ' + this.coordenadaZ;
      this.userService.executeCommand('/tp ' + this.botSeleccionado + ' ' + coordenadas).subscribe(
        (data: any) => {
          if (data.includes('Teleported')) {
            this.alertService.showSuccess(data);
            this.recargar();
          } else {
            // Error al eliminar el bot
            this.alertService.showError(data);
          }
        },
        error => {
          console.error('Error:', error);
          this.alertService.showError(error);
        }
      );
      this.botSeleccionado = null;
    } else {
      this.alertService.showError('No has seleccionado ningún bot');
    }
  }

  changeLocation(e: any){
    console.log(e.target.value);
  }

}
