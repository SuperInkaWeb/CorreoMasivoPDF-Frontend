import { Routes } from '@angular/router';
import { Panelcontrol } from './components/panelcontrol/panelcontrol';
import { Dashboarduser } from './components/dashboarduser/dashboarduser';
import { Linkcorreos } from './components/linkcorreos/linkcorreos';


export const routes: Routes = [

    { 
    path: '', 
    component: Panelcontrol 
  },
  { 
    path: 'dashboard', 
    component: Dashboarduser 
  },
  { 
    path: 'linkcorreos', 
    component: Linkcorreos
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];
