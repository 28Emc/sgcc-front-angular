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
  @Input() btnLoading: boolean = false;
  @Input() btnDisabled: boolean = false;
  @Input() btnText: string = 'Action';
  @Input() btnClasses: string = '';
  @Output() actionBtnClicked: EventEmitter<void> = new EventEmitter<void>();

  onActionBtnClicked(): void {
    this.actionBtnClicked.emit();
  }
}
