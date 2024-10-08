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
  @Input() btnText: string = 'Action';
  @Input() btnClasses: string = '';
  @Output() cancelBtnClicked: EventEmitter<void> = new EventEmitter<void>();

  onCancelBtnClicked(): void {
    this.cancelBtnClicked.emit();
  }
}
