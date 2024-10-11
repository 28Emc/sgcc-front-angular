import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'vex-action-button',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    NgIf
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './action-button.component.html',
  styleUrl: './action-button.component.scss'
})
export class ActionButtonComponent {
  /** Flag que indica bajo que condición el botón mostrará un icono de carga o no (Se asigna "mat:autorenew" como icono por defecto) */
  @Input() btnLoading: boolean = false;
  /** Flag que indica bajo que condición el botón se deshabilitará o no */
  @Input() btnDisabled: boolean = false;
  /** Texto de botón */
  @Input() btnText: string = 'Action Button Name';
  /** Clases de botón separadas por un espacio, aquí también se pueden definir los colores de fondo y textos del mismo. (ejm. "!btn-teal-600 !text-white w-full") */
  @Input() btnClasses: string = '';
  /** Color de botón según paleta de colores definidas en el archivo "tailwind.config.ts", opcional, de no definirse, se dará prioridad a los colores definidos en el atributo "btnClasses" */
  @Input() btnColor: 'primary' | 'accent' | 'warn' | null = null;
  /** Evento o acción a realizar cuando se hizo "click" en el botón */
  @Output() actionBtnClicked: EventEmitter<void> = new EventEmitter<void>();

  onActionBtnClicked(): void {
    this.actionBtnClicked.emit();
  }
}
