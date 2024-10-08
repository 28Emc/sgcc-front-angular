import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationLoaderService } from './core/navigation/navigation-loader.service';

@Component({
  selector: 'vex-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet]
})
export class AppComponent {
  navigationLoaderService = inject(NavigationLoaderService);

  constructor() {
    this.navigationLoaderService.loadNavigation(sessionStorage.getItem('opts') ? JSON.parse(sessionStorage.getItem('opts')!) : null);
  }
}
