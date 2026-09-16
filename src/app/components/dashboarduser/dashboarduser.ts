import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient,HttpBackend } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { take } from 'rxjs';
import { Automatizador } from '../../services/automatizador';
import * as XLSX from 'xlsx';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

interface RegistroTributario {
  id: number;
  created_at: string;
  ruc_emisor: string;
  tipo_doc: string;
  serie_numero: string;
  igv:number;
  monto_total: number;
  estado_sunat: string;

  fecha_emision?: string;
  moneda?: string;
  op_gravadas?: number;
  origen_archivo?: string;
  razon_social_emisor?:string;
}

@Component({
  selector: 'app-dashboarduser',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboarduser.html',
  styleUrl: './dashboarduser.css',
})
export class Dashboarduser implements OnInit {

  private handler = inject(HttpBackend);
  private httpRaw = new HttpClient(this.handler);
  private route = inject(ActivatedRoute);
  

  private http = inject(HttpClient);
  public auth = inject(AuthService);
  private apiUrl = environment.apiUrl;

  // ID del usuario autenticado (Auth0 / Supabase)
  userId: string = '';

  // Signals para estado reactivo
  registros = signal<RegistroTributario[]>([]);
  cargando = signal<boolean>(false);
  procesandoCola = signal<boolean>(false);

  filtroTexto = signal<string>('');

  provider = signal<string>('gmail');

  registrosFiltrados = computed(() => {
    const texto = this.filtroTexto().toLowerCase().trim();
    if (!texto) return this.registros();

    return this.registros().filter(reg =>
      reg.ruc_emisor?.toLowerCase().includes(texto) ||
      reg.serie_numero?.toLowerCase().includes(texto)
    );
  });

  // 2. Función que captura el evento de escritura del input
  actualizarFiltro(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.filtroTexto.set(valor);
  }

  ngOnInit(): void {
   
  console.log('Componente inicializado...');

    // 3. Leer los query params de la URL (?user_id=...&provider=...)
    this.route.queryParams.subscribe(params => {
      if (params['user_id']) {
        this.userId = params['user_id'];
        console.log('userId recuperado de la URL:', this.userId);
      }
      
      if (params['provider']) {
        this.provider.set(params['provider']);
        console.log('provider recuperado de la URL:', this.provider());
      }

      // Una vez obtenidos los datos, cargar los registros
      this.obtenerRegistros();
    });
  
  /*this.auth.user$.subscribe((userProfile) => {
    console.log('Respuesta cruda de Auth0 user$:', userProfile); //  Esto te dirá qué llega de Auth0
    
    if (userProfile && userProfile.sub) {
      this.userId = userProfile.sub;
      console.log('userId asignado correctamente:', this.userId); // Esto confirma la asignación
      this.obtenerRegistros();
    } else {
      console.warn('Auth0 respondió, pero userProfile o userProfile.sub están vacíos/null');
    }
  });*/
  }

  
  // 1. Métodos de Vinculación OAuth2 (Redirigen con el user_id en state)
  vincularGmail(): void {
    window.location.href = `${this.apiUrl}/api/auth/gmail/login?user_id=${this.userId}`;
  }

  vincularOutlook(): void {
    window.location.href = `${this.apiUrl}/api/auth/outlook/login?user_id=${this.userId}`;
  }

  // 2. Consulta de Registros por Usuario
  obtenerRegistros(): void {
  if (!this.userId) return;

  // Llama a http://localhost:8000/api/registros?user_id=...
  const url = `${this.apiUrl}/registros?user_id=${this.userId}`;
  
  this.httpRaw.get<RegistroTributario[]>(url).subscribe({
    next: (data) => {
      // Al hacer .set(), la interfaz se renderiza al instante en vivo
      this.registros.set(data);
    },
    error: (err) => console.error('Error consultando registros:', err)
  });
}

 escanearBandeja(): void {
  if (!this.userId) {
    console.warn('Esperando userId de Auth0...');
    return;
  }

  this.procesandoCola.set(true);

  const urlPost = `${this.apiUrl}/procesar-correos?user_id=${this.userId}&provider=${this.provider()}`;
  const urlEstado = `${this.apiUrl}/estado-escaneo?user_id=${this.userId}`;
  let intervalId: any = null;

  // Función para limpiar el intervalo de forma segura
  const detenerPolling = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    this.procesandoCola.set(false);
  };

  this.httpRaw.post(urlPost, {}).subscribe({
    next: () => {
      // Polling cada 3 segundos
      intervalId = setInterval(() => {
        // 1. Refresca la tabla periódicamente para mostrar lo que va llegando
        this.obtenerRegistros();

        // 2. Consulta el estado real en el backend
        this.httpRaw.get<{ procesando: boolean }>(urlEstado).subscribe({
          next: (res) => {
            if (!res.procesando) {
              detenerPolling();
              this.obtenerRegistros(); // Refresco final al terminar
            }
          },
          error: (err) => {
            console.error('Error al consultar estado:', err);
            // Si la consulta de estado falla puntualmente por red, NO detendremos el polling de inmediato.
            // Continuará en el siguiente ciclo de 3s.
          }
        });
      }, 3000);
    },
    error: (err) => {
      console.error('Error al iniciar escaneo:', err);
      detenerPolling();
    }
  });
}
   limpiarTabla(): void {
  // Vacía el estado local (la pantalla), dejando el arreglo de registros en []
  this.registros.set([]);
}

  


descargarExcel(): void {
    // 1. Validar que existan datos para exportar
    const datosActuales = this.registros();
    if (datosActuales.length === 0) {
      alert('No hay comprobantes en la tabla para exportar.');
      return;
    }

    // 2. Dar formato a las filas con los nombres de columna deseados
    const datosParaExcel = datosActuales.map(reg => ({
      'RUC Emisor': reg.ruc_emisor,
      'Tipo Documento': reg.tipo_doc === '01' ? 'Factura' : reg.tipo_doc,
      'Serie / N°': reg.serie_numero,
      'Fecha Emisión': reg.fecha_emision || 'N/A',
      'Moneda': reg.moneda || 'PEN',
      'Op. Gravadas (S/)': reg.op_gravadas ?? 0,
      'IGV (S/)': reg.igv ?? 0,
      'Monto Total (S/)': reg.monto_total,
      'Estado SUNAT': reg.estado_sunat,
      'Origen': reg.origen_archivo,
      'Razon social':reg.razon_social_emisor
    }));

    // 3. Crear la hoja de trabajo (Worksheet) y el libro (Workbook)
    const hojaTrabajo = XLSX.utils.json_to_sheet(datosParaExcel);
    const libroTrabajo = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libroTrabajo, hojaTrabajo, 'Comprobantes');

    // 4. Generar la fecha actual para el nombre del archivo
    const fecha = new Date().toISOString().split('T')[0];
    const nombreArchivo = `Reporte_Facturas_${fecha}.xlsx`;

    // 5. Disparar la descarga en el navegador
    XLSX.writeFile(libroTrabajo, nombreArchivo);
  }
}












