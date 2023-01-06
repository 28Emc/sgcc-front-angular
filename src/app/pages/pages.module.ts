import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginModule } from './auth/login/login.module';
import { ComingSoonModule } from './coming-soon/coming-soon.module';
import { InternalServerErrorModule } from './errors/internal-server-error/internal-server-error.module';
import { PageNotFoundModule } from './errors/page-not-found/page-not-found.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LoginModule,
    ComingSoonModule,
    InternalServerErrorModule,
    PageNotFoundModule
  ]
})
export class PagesModule { }
