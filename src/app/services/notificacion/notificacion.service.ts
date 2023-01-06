import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  constructor(
    private snackbar: MatSnackBar
  ) { }

  showMessage(msg: string, type: 'DEFAULT' | 'SUCCESS' | 'WARNING' | 'ERROR' = 'DEFAULT', duration?: number, position?: 'center' | 'right'): void {
    let panelClass = [];
    if (type === 'SUCCESS') {
      panelClass.push('bg-teal');
      panelClass.push('text-white');
    } else if (type === 'ERROR') {
      panelClass.push('bg-red');
      panelClass.push('text-white');
    } else if (type === 'WARNING') {
      panelClass.push('bg-orange');
      panelClass.push('text-white');
    } else {
      panelClass = [];
    }

    let options: MatSnackBarConfig = {
      duration,
      horizontalPosition: position ? position : 'right',
      verticalPosition: 'bottom',
      panelClass
    };

    if (!duration) {
      options = { ...options, duration: 5000 };
    }

    this.snackbar.open(msg, null, options);
  }

  close(): void {
    if (this.snackbar) {
      this.snackbar.dismiss();
    }
  }
}
