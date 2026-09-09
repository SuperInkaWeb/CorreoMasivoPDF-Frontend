import { Component,inject,OnInit } from '@angular/core';
import { Automatizador } from '../../services/automatizador';

@Component({
  selector: 'app-panelcontrol',
  imports: [],
  templateUrl: './panelcontrol.html',
  styleUrl: './panelcontrol.css',
})
export class Panelcontrol implements OnInit{
  public automatizador=inject(Automatizador);

  ngOnInit(): void{
    if(this.automatizador.isAuthenticated()){
      this.cargarEstado();
    }
  }

  cargarEstado():void{
    this.automatizador.obtenerEstado().subscribe({
      next:(res)=>console.log('Estado actual de la API:',res),
      error:(err)=>console.error('Error de comunicacion con FatApi',err)


    });
  }

  ejecutarProceso(): void{
    this.automatizador.iniciarProceso().subscribe({
      next:(res)=>{
        alert('¡Proceso de automatizacion iniciado')
        this.automatizador.ejecucionEnProceso.set(false);
      },
      error:(err)=>{
        console.error('Error al iniciar el proceso',err);
        this.automatizador.ejecucionEnProceso.set(false);
      }
    });
  }





}
