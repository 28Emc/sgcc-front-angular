import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(
    private readonly snackbar: MatSnackBar
  ) { }

  showSnackbar(msg: string, type: 'DEFAULT' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO' = 'DEFAULT',
    msDuration?: number, hPosition?: 'center' | 'right', vPosition?: 'top' | 'bottom', action?: string): void {
    let panelClassArr = [];

    switch (type) {
      case 'SUCCESS':
        panelClassArr.push('snackbar-success');
        break;
      case 'WARNING':
        panelClassArr.push('snackbar-warning');
        break;
      case 'ERROR':
        panelClassArr.push('snackbar-error');
        break;
      case 'INFO':
        panelClassArr.push('snackbar-info');
        break;
      case 'DEFAULT':
      default:
        panelClassArr = [];
        break;
    }

    const options: MatSnackBarConfig = {
      duration: msDuration ?? 5000,
      horizontalPosition: hPosition ?? 'right',
      verticalPosition: vPosition ?? 'bottom',
      panelClass: panelClassArr
    };
    if (action) delete options.duration;
    this.snackbar.open(msg, action ?? undefined, options);
  }

  close(): void {
    if (this.snackbar) this.snackbar.dismiss();
  }
}
