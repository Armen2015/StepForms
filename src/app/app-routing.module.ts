import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReactiveformComponent } from './reactiveform/reactiveform.component';
import { Form1Component } from './form1/form1.component';
import { Form2Component } from './form2/form2.component';
import { Form3Component } from './form3/form3.component';
 
/*import { HeroesComponent }      from './heroes/heroes.component';
import { HeroDetailComponent }  from './hero-detail/hero-detail.component';*/
 
const routes: Routes = [
  { path: '', redirectTo: '/step1', pathMatch: 'full' },
  { path: 'reactf', component: ReactiveformComponent },
  { path: 'step1', component: Form1Component },
  { path: 'step2', component: Form2Component },
  { path: 'step3', component: Form3Component },
];
 
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}