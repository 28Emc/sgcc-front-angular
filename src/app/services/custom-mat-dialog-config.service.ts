import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable, signal } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { MAX_WIDTH_MOBILE } from '../utils/constants';

@Injectable({
  providedIn: 'root'
})
export class CustomMatDialogConfigService {
  isMobile = signal(false);

  constructor(
    private readonly breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver.observe([MAX_WIDTH_MOBILE]).subscribe(result => this.isMobile.set(result.matches));
  }

  getDialogConfig(): MatDialogConfig {
    const config = new MatDialogConfig();
    config.disableClose = true;

    if (this.isMobile()) {
      config.width = '100vw';
      config.height = '100vh';
      config.maxWidth = '100vw';
      config.maxHeight = '100vh';
      config.panelClass = 'full-screen-dialog';
    } else {
      config.width = '600px';
      // config.height = '400px';
    }

    return config;
  }
}
