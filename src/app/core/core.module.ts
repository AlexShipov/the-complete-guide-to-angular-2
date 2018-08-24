import { NgModule } from '@angular/core';

import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  imports: [    
    SharedModule,
    AppRoutingModule
  ],
  declarations: [HeaderComponent, HomeComponent],
  exports: [AppRoutingModule, HeaderComponent]
})
export class CoreModule { }
