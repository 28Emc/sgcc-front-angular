import { ChangePasswordComponent } from './../../../app/pages/auth/change-password/change-password.component';
import { BreakpointState, Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { MenuItem } from 'src/@vex/layout/toolbar/toolbar-user/interfaces/menu-item.interface';
import { trackById } from 'src/@vex/utils/track-by';
import { NotificacionService } from 'src/app/services/notificacion/notificacion.service';
import { SecurityService } from 'src/app/services/security/security.service';
import { PopoverRef } from '../popover/popover-ref';

@Component({
  selector: 'vex-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);
  user: any;
  username: string;
  items: MenuItem[] = [
    {
      id: '1',
      icon: 'mat:password',
      label: 'Contraseña',
      description: 'Cambiar la contraseña',
      colorClass: 'text-primary',
      route: '/auth/change-password'
    }
    /* {
      id: '1',
      icon: 'mat:account_circle',
      label: 'My Profile',
      description: 'Personal Information',
      colorClass: 'text-teal',
      route: '/apps/social'
    },
    {
      id: '2',
      icon: 'mat:move_to_inbox',
      label: 'My Inbox',
      description: 'Messages & Latest News',
      colorClass: 'text-primary',
      route: '/apps/chat'
    },
    {
      id: '3',
      icon: 'mat:list_alt',
      label: 'My Projects',
      description: 'Tasks & Active Projects',
      colorClass: 'text-amber',
      route: '/apps/scrumboard'
    },
    {
      id: '4',
      icon: 'mat:table_chart',
      label: 'Billing Information',
      description: 'Pricing & Current Plan',
      colorClass: 'text-purple',
      route: '/pages/pricing'
    } */
  ];
  trackById = trackById;

  constructor(private readonly popoverRef: PopoverRef,
    private readonly breakpointObserver: BreakpointObserver,
    private notificacionService: NotificacionService,
    private securityService: SecurityService,
    private router: Router,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user'));
  }

  close(): void {
    /** Wait for animation to complete and then close */
    setTimeout(() => this.popoverRef.close(), 250);
  }

  redirectTo(to: string): void {
    if (to !== '/auth/change-password') {
      return;
    }

    const d = this.dialog.open(ChangePasswordComponent, {
      data: { user: this.user, isAdmin: false },
      width: "450px",
      maxWidth: "100vw",
      disableClose: true
    });
    const smallDialogSubscription = this.matDialogExtraSmallSub(d);
    d.afterClosed().subscribe(
      (response: any) => {
        let message = response.message;

        if (response.status === 'OK') {
          this.notificacionService.showMessage(message, 'SUCCESS');
        }

        if (response.status === 'ERROR') {
          this.notificacionService.showMessage(message, 'ERROR');
        }

        smallDialogSubscription.unsubscribe();
      });
  }

  logout() {
    this.notificacionService.showMessage('Espere un momento mientras se cierra la sesión...', 'WARNING', 30000);
    this.securityService.cerrarSesión({ id_usuario: this.user.id_usuario }).subscribe({
      next: () => {
        this.notificacionService.close();
        sessionStorage.clear();
        this.popoverRef.close();
        this.router.navigate(['/auth/login']);
      },
      error: (err: HttpErrorResponse) => {
        console.error({ err });
        this.notificacionService.showMessage(err.status == 400 ? err.error : 'Error al cerrar la sesión actual', 'ERROR');
      }
    });
  }

  matDialogExtraSmallSub(d: any): Subscription {
    return this.isExtraSmall.subscribe(
      (size) => {
        if (size.matches) {
          d.updateSize("100vw", "100vh");
        } else {
          d.updateSize("600px", "");
        }
      });
  }
}
