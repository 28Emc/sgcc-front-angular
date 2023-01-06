import { NgModule } from '@angular/core';
import { MatTableResponsiveDirective } from './mat-table-responsive/mat-table-responsive.directive';
import { UploadDirective } from './upload/upload.directive';

@NgModule({
  declarations: [UploadDirective, MatTableResponsiveDirective],
  imports: [],
  exports: [UploadDirective, MatTableResponsiveDirective]
})
export class DirectivesModule { }
