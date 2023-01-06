import { SecurityService } from './../../../../../app/services/security/security.service';
import { NotificacionService } from './../../../../../app/services/notificacion/notificacion.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MenuItem } from '../interfaces/menu-item.interface';
import { trackById } from '../../../../utils/track-by';
import { PopoverRef } from '../../../../components/popover/popover-ref';
import { Observable, Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';

export interface OnlineStatus {
  id: 'online' | 'away' | 'dnd' | 'offline';
  label: string;
  icon: string;
  colorClass: string;
}

@Component({
  selector: 'vex-toolbar-user-dropdown',
  templateUrl: './toolbar-user-dropdown.component.html',
  styleUrls: ['./toolbar-user-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarUserDropdownComponent implements OnInit {

  items: MenuItem[] = [
    {
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
    },
    /* {
      id: '1',
      icon: 'mat:password',
      label: 'Contraseña',
      description: 'Cambiar la contraseña',
      colorClass: 'text-primary',
      route: '/configuracion/restablecer-password'
    } */
  ];

  statuses: OnlineStatus[] = [
    {
      id: 'online',
      label: 'Online',
      icon: 'mat:check_circle',
      colorClass: 'text-green'
    },
    {
      id: 'away',
      label: 'Away',
      icon: 'mat:access_time',
      colorClass: 'text-orange'
    },
    {
      id: 'dnd',
      label: 'Do not disturb',
      icon: 'mat:do_not_disturb',
      colorClass: 'text-red'
    },
    {
      id: 'offline',
      label: 'Offline',
      icon: 'mat:offline_bolt',
      colorClass: 'text-gray'
    }
  ];

  activeStatus: OnlineStatus = this.statuses[0];

  trackById = trackById;

  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);
  user: any;
  username: string;

  constructor(private cd: ChangeDetectorRef,
              private popoverRef: PopoverRef<ToolbarUserDropdownComponent>,
              private readonly breakpointObserver: BreakpointObserver,
              private notificacionService: NotificacionService,
              private securityService: SecurityService,
              private router: Router,
              private dialog: MatDialog) { }

  ngOnInit() {
  }

  setStatus(status: OnlineStatus) {
    this.activeStatus = status;
    this.cd.markForCheck();
  }

  close() {
    this.popoverRef.close();
  }

  logout() {
    let data = { id_usuario: this.user.id_usuario };
    this.notificacionService.showMessage('Espere un momento mientras se cierra la sesión...', 'WARNING', 30000);
    this.securityService.cerrarSesión(data).subscribe({
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

  /* redirectTo(to: string): void {
    if (to === '/configuracion/perfil') {
      this.router.navigate([to]);
    } else if (to === '/configuracion/restablecer-password') {
      const d = this.dialog.open(CambiarPasswordComponent, {
        data: { user: this.user, isAdmin: false },
        width: "450px",
        maxWidth: "100vw",
        disableClose: true
      });
      const smallDialogSubscription = this.matDialogExtraSmallSub(d);
      d.afterClosed().subscribe((response: any) => {
        let message = response.message;

        if (response.status === 'OK') {
          this.notificacionService.showMessage(message, 'SUCCESS');
        }

        if (response.status === 'ERROR') {
          this.notificacionService.showMessage(message, 'ERROR');
        }

        smallDialogSubscription.unsubscribe();
      });
    } else {
      return;
    }
  } */

  matDialogExtraSmallSub(d: any): Subscription {
    return this.isExtraSmall.subscribe(
      (size) => {
        if (size.matches) {
          d.updateSize("100vw", "100vh");
        } else {
          d.updateSize("600px", "");
        }
      }
    );
  }
}
