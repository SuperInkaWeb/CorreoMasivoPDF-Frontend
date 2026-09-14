import { Injectable,Inject,signal,computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

export interface AutomatizacionStatus{
  estado:string;
  detalles?:string;
  ultimasEjecuciones?:any[];
}

@Injectable({
  providedIn: 'root',
})
export class Automatizador {
  private http=inject(HttpClient);
  private auth=inject(AuthService);
  private readonly API_URL='http://localhost:8000/api';

  readonly user=toSignal(this.auth.user$);
  readonly isAuthenticated=toSignal(this.auth.isAuthenticated$,{initialValue:false});
  readonly isLoading=toSignal(this.auth.isLoading$,{initialValue:true});
  readonly ejecucionEnProceso=signal<boolean>(false);
  readonly userRoles=computed(()=>{
    const userData=this.user();
    if(!userData)return[];
    return userData['https://automatizador-sunat.com/roles'] || [];
  });

  readonly isAdmin=computed(()=>this.userRoles().includes('Admin'));
  obtenerEstado():Observable<AutomatizacionStatus>{
    return this.http.get<AutomatizacionStatus>(`${this.API_URL}/estado`);
  }

  readonly userId = computed(() => {
  const userData = this.user();
  return userData ? userData.sub : null; 
});

  iniciarProceso():Observable<any>{
    this.ejecucionEnProceso.set(true);
    return this.http.post(`${this.API_URL}/iniciar`,{});
  }
  detenerProceso():Observable<any>{
    return this.http.post(`${this.API_URL}/detener`,{});
  }

  login():void{
    this.auth.loginWithRedirect();
  }
  logout():void{
    this.auth.logout({logoutParams:{returnTo:window.location.origin}});
  }







}
