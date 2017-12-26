import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule } from '@angular/forms';
import { ReactiveformComponent } from './reactiveform/reactiveform.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './services/user.service';
import { HomeComponent } from './home/home.component';
import { Routes, RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { MyDate } from './pipes/myDate.pipe';
import { CardNumber } from './pipes/cardNumber.pipe';
import { PopupModule } from 'ng2-opd-popup';
import { Form1Component } from './form1/form1.component';
import { ReactformComponent } from './reactform/reactform.component';
import { AppRoutingModule }     from './app-routing.module';
import { Form2Component } from './form2/form2.component';
import { Form3Component } from './form3/form3.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ReactiveformComponent,
    HomeComponent,
    MyDate,
    CardNumber,
    Form1Component,
    ReactformComponent,
    Form2Component,
    Form3Component
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    HttpClientModule,
    HttpModule,
    PopupModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
