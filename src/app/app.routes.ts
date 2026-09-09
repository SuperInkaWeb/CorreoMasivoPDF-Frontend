import { Routes } from '@angular/router';
import { Panelcontrol } from './components/panelcontrol/panelcontrol';

export const routes: Routes = [

    { 
    path: '', 
    component: Panelcontrol 
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];
