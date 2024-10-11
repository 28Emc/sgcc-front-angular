import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'vex-cancel-button',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './cancel-button.component.html',
  styleUrl: './cancel-button.component.scss'
})
export class CancelButtonComponent {
  /** Flag que indica bajo que condición el botón se deshabilitará o no */
  @Input() btnDisabled: boolean = false;
  /** Texto de botón */
  @Input() btnText: string = 'Cancel Button Name';
  /** Clases de botón separadas por un espacio, aquí también se pueden definir los colores de fondo y textos del mismo. (ejm. "sm:w-auto w-full !rounded-md") */
  @Input() btnClasses: string = '';
  /** Evento o acción a realizar cuando se hizo "click" en el botón */
  @Output() cancelBtnClicked: EventEmitter<void> = new EventEmitter<void>();

  onCancelBtnClicked(): void {
    this.cancelBtnClicked.emit();
  }
}
